#pragma strict
import System.Text.RegularExpressions;

/**
	AROperation script: Controls how the Augmented Reality operation is performed.
**/

var simboloSuma : GameObject;      
var simboloResta : GameObject;
var numeros : GameObject [];

var camara : GameObject;     								// Augmented Reality Camera.
private var posicion : Vector3[];    							// Initial dummy position. 

private var munyecosIzq : GameObject[]; 				// Static dummy array (left side)
private var munyecosIzqNav : GameObject[]; 			// Navigation dummy array (left side)
private var munyecosDcha : GameObject[]; 				// Static dummy array (right side)
private var munyecosDchaNav : GameObject[]; 		// Navigation dummy array (right side)

private var desplazamientoDestino : Vector3;				// Each dummy will have an offset to be aligned in formation.
private var numero1 : int;										// First operand.
private var numero2 : int;										// Second operand.
private var arraysRellenos : boolean;							// Boolean variable thar will be used to check if all the navigation dummies are created.
private var enPosicion : int;										// Counts how many dummies reached their position in the "equal" side.
private var resultadoOperacion : int;							// Result of the operation requested.
private var agente : NavMeshAgent;							// Navigation agent. This component will make the dummies move intelligently through the map.
private var finOperacion : boolean;							// Checks if the operation is finished, so the back button can be shown.
private var direccionBase = new Vector3(90, 0, 7);	// Base coordinates for the dummies. The offset will be added to place them according to the formation.
private var izquierda : int = 0;									// izquierda and derecha controls which side of the operation symbol are we using to place the dummies.
private var derecha : int = 1;
private var colocados : boolean[];							// Boolean array: In the"i" position of it we will have a 0 if the dummy is not in its final position or a 1 if it reached it.
private var hit : RaycastHit;										// Object hit with the collision ray.
private var simboloOp : GameObject;

/**
	Start function: Initializes variables as explained below.
**/
function Start () {

	// Get the numbers given by the user.
	//numero1 = dataInput.num1;
	//numero2 = dataInput.num2;
	
	// Get the operation chosen.
	//var tipoOperacion = operationSelection.tipoOp;
	
	// Debugging lines.
	var tipoOperacion = "+";
	numero1 = 3;
	numero2 = 3;
	
	// Initially we won't check if the dummies reached their destination.
	enPosicion = -1;
	
	// The operation is not done yet.
	finOperacion = false;
	
	// Allocate memory for the static dummies arrays (left and right).
	munyecosIzq = new GameObject[numero1];
	munyecosDcha = new GameObject[numero2];
	
	// Offset is set to 0.
	desplazamientoDestino.x = 0;
	desplazamientoDestino.y = 0;
	desplazamientoDestino.z = 0;
		
	// Instantiate dummies in the scene and the number (amount) of them in each side of the operation symbol.
	yield StartCoroutine(instanciarMunecos(numero1, izquierda));
	var cantidad1 = GameObject.Instantiate(numeros[numero1], new Vector3(-110, 0, -75), Quaternion.Euler(0,180,0));
	cantidad1.transform.parent = GameObject.Find("ImageTarget").transform;

	yield StartCoroutine(instanciarMunecos(numero2, derecha));
	var cantidad2 = GameObject.Instantiate(numeros[numero2], new Vector3(20, 0, -75), Quaternion.Euler(0,180,0));
	cantidad2.transform.parent = GameObject.Find("ImageTarget").transform;

		
	// Make the dummies walk through the map to their destination in the "equal" side.
	switch (tipoOperacion) {
		case "+": 
				resultadoOperacion = numero1+numero2;
				operacionSuma(); 
				simboloOp = GameObject.Instantiate(simboloSuma, new Vector3(-50, 0, -10), Quaternion.identity);
				simboloOp.transform.parent = GameObject.Find("ImageTarget").transform;
			break;
		case "-":	
				resultadoOperacion = numero1-numero2;
				operacionResta();
				simboloOp = GameObject.Instantiate(simboloResta, new Vector3(-50, 0, -10), Quaternion.identity);
				simboloOp.transform.parent = GameObject.Find("ImageTarget").transform;
			break;
	}
	
	// Allocate memory for the boolean array. The amount of elements of this array will be equal to the operation result.
	colocados = new boolean[resultadoOperacion];
	
	// The array will be set to false initially.
	for (var i=0; i<resultadoOperacion; i++)
		colocados[i] = false;
}

/**
	instanciarMunecos function: This function will give a certain position to each of the dummies. They are located in a 3x3 matrix. We will have 5 dummies max.
**/
function instanciarMunecos (numMunecos : int, lado : int) {
	
	var coordenadas : Vector3;
	
	var desplZ = 0;
	var desplX : int;
	var posicion : Vector3;
	
	coordenadas = Vector3(0, 0, 0);
		
	for (var i = 0; i < numMunecos; i++) {
	
		// Calculation of the offset for each dummy.
		if (Mathf.Floor(i%3) == 0)
			desplX = 0;
		else
			desplX = 1;
		
		if (i == 3) 
			desplZ = 1;
		
		// coordenadas will keep the result of all the calculations made in the previous lines.
		coordenadas = Vector3((coordenadas.x+25)*desplX, 0, coordenadas.z-(25*desplZ));
		
		if (lado == izquierda) {
			posicion = Vector3(coordenadas.x-125, 0, coordenadas.z);
			
			munyecosIzq[i] = GameObject.Find("munyecoIzq"+(i+1));
			munyecosIzq[i].transform.position = posicion;
			//munyecosIzq[i].transform.parent = camara.transform;                         // All dummies are child of the AR Camera.
			munyecosIzq[i].transform.Rotate(Vector3.up*180);								// Left side dummies are looking forward.

		}
		else {
			posicion = Vector3(coordenadas.x-20, 0, coordenadas.z);
			
			munyecosDcha[i] = GameObject.Find("munyecoDcha"+(i+1));
			munyecosDcha[i].transform.position = posicion;
			//munyecosDcha[i].transform.parent = camara.transform;                         // All dummies are child of the AR Camera.
		}																										// Left side dummies are looking back.
		
		if (desplZ)
			desplZ = 0;
		
		yield WaitForSeconds(0.75);
	}
	
}

/**
	operationSuma function: Performs the addition operation.
**/
function operacionSuma () {

	// We will have left and right side (of the operation symbol) dummies walking around.
	munyecosIzqNav = new GameObject[numero1];
	munyecosDchaNav = new GameObject[numero2];
	
	// The first row will move before the second one, so the result is more smooth.
	if (numero1 >= 3) {
		for (var i=2; i>=0; i--) {
			munyecosIzqNav[i] = GameObject.Instantiate(munyecosIzq[i], munyecosIzq[i].transform.position, munyecosIzq[i].transform.rotation);
			
			// The final destination of each dummy is set according to its position in the array.
			desplazamientoDestino.x = i%3;
			
			desplazamientoDestino.z = -i/3;
			
			munyecosIzqNav[i].GetComponent.<NavMeshAgent>().SetDestination(direccionBase + desplazamientoDestino*25);
			munyecosIzqNav[i].transform.localScale = new Vector3 (0.3, 0.3, 0.3);
			munyecosIzqNav[i].GetComponent.<Animation>().Play("Walk");
			munyecosIzqNav[i].transform.parent = GameObject.Find("ImageTarget").transform;
			yield WaitForSeconds(1);
		}
				
		yield WaitForSeconds(2);

		for (i=numero1-1; i>=3; i--) {
			munyecosIzqNav[i] = GameObject.Instantiate(munyecosIzq[i], munyecosIzq[i].transform.position, munyecosIzq[i].transform.rotation);
			
			desplazamientoDestino.x = i%3;
			
			desplazamientoDestino.z = -i/3;
			
			munyecosIzqNav[i].GetComponent.<NavMeshAgent>().SetDestination(direccionBase + desplazamientoDestino*25);
			munyecosIzqNav[i].transform.localScale = new Vector3 (0.3, 0.3, 0.3);
			munyecosIzqNav[i].GetComponent.<Animation>().Play("Walk");
			munyecosIzqNav[i].transform.parent = GameObject.Find("ImageTarget").transform;
			yield WaitForSeconds(0.75);
		}
	}
	else {
		for (i=numero1-1; i>=0; i--) {
			munyecosIzqNav[i] = GameObject.Instantiate(munyecosIzq[i], munyecosIzq[i].transform.position, munyecosIzq[i].transform.rotation);
			
			desplazamientoDestino.x = i%3;
			
			// Here the number of dummies is less than 3, so no Z offset is required (we will have only one row of dummies).
					
			munyecosIzqNav[i].GetComponent.<NavMeshAgent>().SetDestination(direccionBase + desplazamientoDestino*25);
			munyecosIzqNav[i].transform.localScale = new Vector3 (0.3, 0.3, 0.3);
			munyecosIzqNav[i].GetComponent.<Animation>().Play("Walk");
			munyecosIzqNav[i].transform.parent = GameObject.Find("ImageTarget").transform;
			yield WaitForSeconds(0.75);
		}
	}
	
	yield WaitForSeconds(2);
	
	// Same for the right side of the operation symbol.
	if (numero2 >= 3) {
		for (var j=2; j>=0; j--) {
			munyecosDchaNav[j] = GameObject.Instantiate(munyecosDcha[j], munyecosDcha[j].transform.position, munyecosDcha[j].transform.rotation);
			
			desplazamientoDestino.x = (j+numero1)%3;
			
			desplazamientoDestino.z = -(j+numero1)/3;
			
			munyecosDchaNav[j].GetComponent.<NavMeshAgent>().SetDestination(direccionBase + desplazamientoDestino*25);
			munyecosDchaNav[j].transform.localScale = new Vector3 (0.3, 0.3, 0.3);
			munyecosDchaNav[j].GetComponent.<Animation>().Play("Walk");
			munyecosDchaNav[j].transform.parent = GameObject.Find("ImageTarget").transform;
			yield WaitForSeconds(1);
		}
		
		yield WaitForSeconds(3.5);
	
		for (j=numero2-1; j>=3; j--) {
			munyecosDchaNav[j] = GameObject.Instantiate(munyecosDcha[j], munyecosDcha[j].transform.position, munyecosDcha[j].transform.rotation);
			
			desplazamientoDestino.x = (j+numero1)%3;
			
			desplazamientoDestino.z = -(j+numero1)/3;
				
			munyecosDchaNav[j].GetComponent.<NavMeshAgent>().SetDestination(direccionBase + desplazamientoDestino*25);
			munyecosDchaNav[j].transform.localScale = new Vector3 (0.3, 0.3, 0.3);
			munyecosDchaNav[j].GetComponent.<Animation>().Play("Walk");
			munyecosDchaNav[j].transform.parent = GameObject.Find("ImageTarget").transform;
			yield WaitForSeconds(0.75);
		}
	}
	else {
		for (j=numero2-1; j>=0; j--) {
			munyecosDchaNav[j] = GameObject.Instantiate(munyecosDcha[j], munyecosDcha[j].transform.position, munyecosDcha[j].transform.rotation);
			
			desplazamientoDestino.x = (j+numero1)%3;
			
			desplazamientoDestino.z = -(j+numero1)/3;
				
			munyecosDchaNav[j].GetComponent.<NavMeshAgent>().SetDestination(direccionBase + desplazamientoDestino*25);
			munyecosDchaNav[j].transform.localScale = new Vector3 (0.3, 0.3, 0.3);
			munyecosDchaNav[j].GetComponent.<Animation>().Play("Walk");
			munyecosDchaNav[j].transform.parent = GameObject.Find("ImageTarget").transform;
			yield WaitForSeconds(0.75);
		}
	}
	
	// The dummies are walking to their destination, it's time to check when they reach it in the Update function.
	arraysRellenos = true;
	enPosicion = 0;
}

/**
	operacionResta function: Performs the substraction operation.
**/
function operacionResta() {

	// In this case we will have only left side dummies walking through the map (we don't allow negative results).
	munyecosIzqNav = new GameObject[numero1-numero2];

	// The first row will move before the second one, so the result is more smooth.
	if (resultadoOperacion >= 3) {
		for (var i=2; i>=0; i--) {
			munyecosIzqNav[i] = GameObject.Instantiate(munyecosIzq[i], munyecosIzq[i].transform.position, munyecosIzq[i].transform.rotation);
			
			// The final destination of each dummy is set according to its position in the array.
			desplazamientoDestino.x = i%3;
			
			desplazamientoDestino.z = -i/3;
			
			munyecosIzqNav[i].GetComponent.<NavMeshAgent>().SetDestination(direccionBase + desplazamientoDestino*50);
			munyecosIzqNav[i].GetComponent.<Animation>().Play("Walk");

			yield WaitForSeconds(1);
		}
				
		yield WaitForSeconds(2);

		for (i=resultadoOperacion-1; i>=3; i--) {
			munyecosIzqNav[i] = GameObject.Instantiate(munyecosIzq[i], munyecosIzq[i].transform.position, munyecosIzq[i].transform.rotation);
			
			desplazamientoDestino.x = i%3;
			
			desplazamientoDestino.z = -i/3;
			
			munyecosIzqNav[i].GetComponent.<NavMeshAgent>().SetDestination(direccionBase + desplazamientoDestino*50);
			munyecosIzqNav[i].GetComponent.<Animation>().Play("Walk");
			yield WaitForSeconds(0.75);
		}
	}
	else {
		for (i=resultadoOperacion-1; i>=0; i--) {
			munyecosIzqNav[i] = GameObject.Instantiate(munyecosIzq[i], munyecosIzq[i].transform.position, munyecosIzq[i].transform.rotation);
			
			desplazamientoDestino.x = i%3;
				
			munyecosIzqNav[i].GetComponent.<NavMeshAgent>().SetDestination(direccionBase + desplazamientoDestino*50);
			munyecosIzqNav[i].GetComponent.<Animation>().Play("Walk");
			yield WaitForSeconds(0.75);
		}
	}
	
	arraysRellenos = true;
	enPosicion = 0;
}

/**
	Update function: Here we check when the dummies reach their destination. If this happens, each of them are rotated to face the user (so he can see their face) and 
	when all of them are finished walking, the result number is shown below them.
**/
function Update () {
	
	if (!finOperacion && arraysRellenos && resultadoOperacion > 0) {

		// We check if the left and right side dummies are in position using "colocados". 
		for (var i=0; i<munyecosIzqNav.Length; i++) {
			agente = munyecosIzqNav[i].GetComponent.<NavMeshAgent>();
			
			if (!colocados[i] && agente.pathStatus == NavMeshPathStatus.PathComplete && Mathf.Approximately(agente.remainingDistance, 0.000)) {
				colocados[i] = true;
				munyecosIzqNav[i].transform.eulerAngles.y = 180.000;
				munyecosIzqNav[i].GetComponent.<Animation>().Play("Wait");
				enPosicion++;
			}
		}
		
		for (var j=0; j<munyecosDchaNav.Length; j++) {
			agente = munyecosDchaNav[j].GetComponent.<NavMeshAgent>();
			
			if (!colocados[numero1+j] && agente.pathStatus == NavMeshPathStatus.PathComplete && Mathf.Approximately(agente.remainingDistance, 0.000)) {
				colocados[numero1+j] = true;
				munyecosDchaNav[j].transform.eulerAngles.y = 180.000;
				munyecosDchaNav[j].GetComponent.<Animation>().Play("Wait");
				enPosicion++;
			}
		}
	}
	
	// If all the dummies are in position, the operation is finished.
	if (!finOperacion && (enPosicion == resultadoOperacion)) {
		var numResultado = GameObject.Instantiate(numeros[resultadoOperacion], new Vector3(125, 0, -75), Quaternion.Euler(0,180,0));
		numResultado.transform.parent = GameObject.Find("ImageTarget").transform;
		finOperacion = true;
	}
	
	// If  the operation is finished and we can show the "Back" button.
	if (finOperacion) {
		GameObject.Find("backButton").GetComponent.<MeshRenderer>().enabled = true;
		GameObject.Find("backButton").GetComponent.<BoxCollider>().enabled = true;
	}	
	
	// Here we check when the "Back" button is clicked. If this happens, the game will go to the operation selection screen.
	if (Input.GetButtonDown("Fire1")) {
		var ray = Camera.main.ScreenPointToRay(Input.mousePosition);

       if (Physics.Raycast(ray, hit, 1000)) {
	       	if (hit.collider.gameObject.name == "backButton") {
	       		operationSelection.tipoOp = "";	
	            Application.LoadLevel("userInterface");
	           
	         }
	         print(hit.collider.gameObject.name);
        }
	}
}

