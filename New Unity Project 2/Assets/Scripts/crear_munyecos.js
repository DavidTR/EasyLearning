#pragma strict
import System.Text.RegularExpressions;

// Estos son los modelos de las operaciones. Segun la que el usuario seleccione se instanciara uno u otro.
var simboloSuma : GameObject;      
var simboloResta : GameObject;
var numeros : GameObject [];

var camara : GameObject;     // La camara AR
@HideInInspector
var posicion : Vector3[];    // Posicion de inicio de los muñecos

@HideInInspector
var munyecosIzq : GameObject[]; // Vector de instancias de muñecos operando (izda)
@HideInInspector
var munyecosIzqNav : GameObject[]; // Vector de instancias de muñecos navegacion (izda)
@HideInInspector
var munyecosDcha : GameObject[]; // Vector de instancias de muñecos operando (dcha)
@HideInInspector
var munyecosDchaNav : GameObject[]; // Vector de instancias de muñecos navegacion (dcha)

@HideInInspector
var desplazamientoDestino : Vector3;
@HideInInspector
var operationSelect : operationSelection;
@HideInInspector
var numero1 : int;
@HideInInspector
var numero2 : int;
@HideInInspector
var arraysRellenos : boolean;
@HideInInspector
var enPosicion : int;
@HideInInspector
var resultadoOperacion : int;
@HideInInspector
var agente : NavMeshAgent;
@HideInInspector
var finOperacion : boolean;
private var nuevaLinea : boolean;
private var direccionBase = new Vector3(200, 0, 35);
private var izquierda : int = 0;
private var derecha : int = 1;

/*** START ***/
function Start () {

	//operationSelect = Camera.main.GetComponent.<operationSelection>();

	// Recogemos los numeros introducidos por el usuario.
	numero1 = dataInput.num1;
	numero2 = dataInput.num2;
	
	// Adicionalmente se recoge el tipo de operacion (string).
	var tipoOperacion = operationSelection.tipoOp;
	
	//var tipoOperacion = "+";
	//numero1 = 5;
	//numero2 = 5;
	
	// Se utiliza para saber si los muñecos han llegado todos a su destino, momento en el que instanciamos el numero del resultado.
	enPosicion = -1;
	
	// Se utiliza para evitar comprobaciones una vez toda la animacion ha acabado.
	finOperacion = false;
	
	// Reservamos espacio para los arrays de muñecos.
	munyecosIzq = new GameObject[numero1];
	munyecosDcha = new GameObject[numero2];
	
	desplazamientoDestino.x = 0;
	desplazamientoDestino.y = 0;
	desplazamientoDestino.z = 0;
		
	// Instanciamos todos los muñecos de la escena.
	yield StartCoroutine(instanciarMunecos(numero1, izquierda));
	GameObject.Instantiate(numeros[numero1], new Vector3(-210, 0, -150), Quaternion.Euler(0,180,0));

	yield StartCoroutine(instanciarMunecos(numero2, derecha));
	GameObject.Instantiate(numeros[numero2], new Vector3(0, 0, -150), Quaternion.Euler(0,180,0));
		
	// Hacer que los muñecos anden al destino.
	switch (tipoOperacion) {
		case "+": 
				resultadoOperacion = numero1+numero2;
				operacionSuma(); 
				GameObject.Instantiate(simboloSuma, new Vector3(-100, 0, -20), Quaternion.identity);
			break;
		case "-":	
				resultadoOperacion = numero1-numero2;
				operacionResta();
				GameObject.Instantiate(simboloResta, new Vector3(-100, 0, -20), Quaternion.identity);
			break;
	}
}

/*** INSTANCIAR MUÑECOS ***/
function instanciarMunecos (numMunecos : int, lado : int) {
	
	var coordenadas : Vector3;
	
	// Instanciamos los muñecos de ambos lados, los guardamos en su respectivo array de munyecos.
	var desplZ = 0;
	var desplX : int;
	var posicion : Vector3;
	var animacion : Animation;
	
	coordenadas = Vector3(0, 0, 0);
		
	for (var i = 0; i < numMunecos; i++) {
	
		if (Mathf.Floor(i%3) == 0)
			desplX = 0;
		else
			desplX = 1;
		
		if (i == 3) 
			desplZ = 1;
			
		coordenadas = Vector3((coordenadas.x+50)*desplX, 0, coordenadas.z-(50*desplZ));
		
		if (lado == izquierda) {
			posicion = Vector3(coordenadas.x-250, 0, coordenadas.z);
			
			munyecosIzq[i] = GameObject.Find("munyecoIzq"+(i+1));
			munyecosIzq[i].transform.position = posicion;
			munyecosIzq[i].transform.parent = camara.transform;                         // Todos los muñecos de la izquierda son hijos de la camara AR
			munyecosIzq[i].transform.Rotate(Vector3.up*180);

		}
		else {
			posicion = Vector3(coordenadas.x-40, 0, coordenadas.z);
			
			munyecosDcha[i] = GameObject.Find("munyecoDcha"+(i+1));
			munyecosDcha[i].transform.position = posicion;
			munyecosDcha[i].transform.parent = camara.transform;                         // Todos los muñecos de la derecha son hijos de la camara AR
		}
		
		if (desplZ)
			desplZ = 0;
		
		yield WaitForSeconds(0.75);
	}
	
}

/*** OPERACION SUMA ***/
function operacionSuma () {
	munyecosIzqNav = new GameObject[numero1];
	munyecosDchaNav = new GameObject[numero2];
	
	// Creamos los muñecos de navegacion en dos partes para que los de la primera fila se vayan moviendo antes y no haya choques.
	if (numero1 >= 3) {
		for (var i=2; i>=0; i--) {
			munyecosIzqNav[i] = GameObject.Instantiate(munyecosIzq[i], munyecosIzq[i].transform.position, munyecosIzq[i].transform.rotation);
			
			// Calcular posicion de destino para cada muñeco.
			desplazamientoDestino.x = i%3;
			
			desplazamientoDestino.z = -i/3;
			
			munyecosIzqNav[i].GetComponent.<NavMeshAgent>().SetDestination(direccionBase + desplazamientoDestino*50);
			munyecosIzqNav[i].GetComponent.<Animation>().Play("Walk");
			yield WaitForSeconds(1);
		}
				
		yield WaitForSeconds(2);

		for (i=numero1-1; i>=3; i--) {
			munyecosIzqNav[i] = GameObject.Instantiate(munyecosIzq[i], munyecosIzq[i].transform.position, munyecosIzq[i].transform.rotation);
			
			// Calcular posicion de destino para cada muñeco.
			desplazamientoDestino.x = i%3;
			
			desplazamientoDestino.z = -i/3;
			
			munyecosIzqNav[i].GetComponent.<NavMeshAgent>().SetDestination(direccionBase + desplazamientoDestino*50);
			munyecosIzqNav[i].GetComponent.<Animation>().Play("Walk");
			yield WaitForSeconds(0.75);
		}
	}
	else {
		for (i=numero1-1; i>=0; i--) {
			munyecosIzqNav[i] = GameObject.Instantiate(munyecosIzq[i], munyecosIzq[i].transform.position, munyecosIzq[i].transform.rotation);
			
			// Calcular posicion de destino para cada muñeco.
			desplazamientoDestino.x = i%3;
				
			munyecosIzqNav[i].GetComponent.<NavMeshAgent>().SetDestination(direccionBase + desplazamientoDestino*50);
			munyecosIzqNav[i].GetComponent.<Animation>().Play("Walk");
			yield WaitForSeconds(0.75);
		}
	}
	
	yield WaitForSeconds(2);
	
	// Creamos los muñecos de navegacion en dos partes para que los de la primera fila se vayan moviendo antes y no haya choques.
	if (numero2 >= 3) {
		for (var j=2; j>=0; j--) {
			munyecosDchaNav[j] = GameObject.Instantiate(munyecosDcha[j], munyecosDcha[j].transform.position, munyecosDcha[j].transform.rotation);
			
			// Calcular posicion de destino para cada muñeco.
			desplazamientoDestino.x = (j+numero1)%3;
			
			desplazamientoDestino.z = -(j+numero1)/3;
			
			munyecosDchaNav[j].GetComponent.<NavMeshAgent>().SetDestination(direccionBase + desplazamientoDestino*50);
			munyecosDchaNav[j].GetComponent.<Animation>().Play("Walk");
			yield WaitForSeconds(1);
		}
		
		yield WaitForSeconds(3.5);
	
		for (j=numero2-1; j>=3; j--) {
			munyecosDchaNav[j] = GameObject.Instantiate(munyecosDcha[j], munyecosDcha[j].transform.position, munyecosDcha[j].transform.rotation);
			
			// Calcular posicion de destino para cada muñeco.
			desplazamientoDestino.x = (j+numero1)%3;
			
			desplazamientoDestino.z = -(j+numero1)/3;
				
			munyecosDchaNav[j].GetComponent.<NavMeshAgent>().SetDestination(direccionBase + desplazamientoDestino*50);
			munyecosDchaNav[j].GetComponent.<Animation>().Play("Walk");
			yield WaitForSeconds(0.75);
		}
	}
	else {
		for (j=numero2-1; j>=0; j--) {
			munyecosDchaNav[j] = GameObject.Instantiate(munyecosDcha[j], munyecosDcha[j].transform.position, munyecosDcha[j].transform.rotation);
			
			// Calcular posicion de destino para cada muñeco.
			desplazamientoDestino.x = (j+numero1)%3;
				
			munyecosDchaNav[j].GetComponent.<NavMeshAgent>().SetDestination(direccionBase + desplazamientoDestino*50);
			munyecosDchaNav[j].GetComponent.<Animation>().Play("Walk");
			yield WaitForSeconds(0.75);
		}
	}
	arraysRellenos = true;
	enPosicion = 0;
}

/*** OPERACION RESTA ***/
function operacionResta() {
	munyecosIzqNav = new GameObject[numero1-numero2];

	// Creamos los muñecos de navegacion en dos partes para que los de la primera fila se vayan moviendo antes y no haya choques.
	if (resultadoOperacion >= 3) {
		for (var i=2; i>=0; i--) {
			munyecosIzqNav[i] = GameObject.Instantiate(munyecosIzq[i], munyecosIzq[i].transform.position, munyecosIzq[i].transform.rotation);
			
			// Calcular posicion de destino para cada muñeco.
			desplazamientoDestino.x = i%3;
			
			desplazamientoDestino.z = -i/3;
			
			munyecosIzqNav[i].GetComponent.<NavMeshAgent>().SetDestination(direccionBase + desplazamientoDestino*50);
			munyecosIzqNav[i].GetComponent.<Animation>().Play("Walk");

			yield WaitForSeconds(1);
		}
				
		yield WaitForSeconds(2);

		for (i=resultadoOperacion-1; i>=3; i--) {
			munyecosIzqNav[i] = GameObject.Instantiate(munyecosIzq[i], munyecosIzq[i].transform.position, munyecosIzq[i].transform.rotation);
			
			// Calcular posicion de destino para cada muñeco.
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
			
			// Calcular posicion de destino para cada muñeco.
			desplazamientoDestino.x = i%3;
				
			munyecosIzqNav[i].GetComponent.<NavMeshAgent>().SetDestination(direccionBase + desplazamientoDestino*50);
			munyecosIzqNav[i].GetComponent.<Animation>().Play("Walk");
			yield WaitForSeconds(0.75);
		}
	}
	
	arraysRellenos = true;
	enPosicion = 0;
}

/*** UPDATE ***/
function Update () {
	
	if (!finOperacion && arraysRellenos && resultadoOperacion > 0) {

		// Rotamos todos los muñecos para que el usuario les vea.
		for (var i=0; i<munyecosIzqNav.Length; i++) {
			agente = munyecosIzqNav[i].GetComponent.<NavMeshAgent>();
			
			if (!(Mathf.Approximately(munyecosIzqNav[i].transform.eulerAngles.y, 180.000)) && agente.pathStatus == NavMeshPathStatus.PathComplete && agente.remainingDistance == 0) {
				munyecosIzqNav[i].transform.eulerAngles.y = 180.000;
				munyecosIzqNav[i].GetComponent.<Animation>().Play("Wait");
				enPosicion++;
			}
		}
		
		for (var j=0; j<munyecosDchaNav.Length; j++) {
			agente = munyecosDchaNav[j].GetComponent.<NavMeshAgent>();
			
			if (!(Mathf.Approximately(munyecosDchaNav[j].transform.eulerAngles.y, 180.000)) && agente.pathStatus == NavMeshPathStatus.PathComplete && agente.remainingDistance == 0) {
				munyecosDchaNav[j].transform.eulerAngles.y = 180.000;
				munyecosDchaNav[j].GetComponent.<Animation>().Play("Wait");
				enPosicion++;
			}
		}
	}
	
	if (!finOperacion && (enPosicion == resultadoOperacion)) {
		GameObject.Instantiate(numeros[resultadoOperacion], new Vector3(250, 0, -150), Quaternion.Euler(0,180,0));
		finOperacion = true;
	}
}
