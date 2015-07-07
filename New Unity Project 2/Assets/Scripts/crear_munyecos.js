#pragma strict
import System.Text.RegularExpressions;


var pref : GameObject;       // El prefab que entra como parametro, del que se instancian las copias
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
var agente : NavMeshAgent[]; // Vector de componentes NavMeshAgent de cada muñeco (replicados de prefab)
@HideInInspector
var operationSelect : operationSelection;
@HideInInspector
var numero1 : int;
@HideInInspector
var numero2 : int;
@HideInInspector
var generadosIzquierda : boolean = false;
private var izquierda : int = 0;
private var derecha : int = 1;


function Start () {

	//operationSelect = Camera.main.GetComponent.<operationSelection>();

	// Recogemos los numeros introducidos por el usuario.
	//numero1 = dataInput.num1;
	//numero2 = dataInput.num2;
	
	// Adicionalmente se recoge el tipo de operacion (string).
	//var tipoOperacion = operationSelection.tipoOp;
	
	var tipoOperacion = "+";
	numero1 = 5;
	numero2 = 4;
	
	// Reservamos espacio para los arrays de muñecos.
	munyecosIzq = new GameObject[numero1];
	munyecosDcha = new GameObject[numero2];
		
	// Instanciamos todos los muñecos de la escena.
	yield StartCoroutine(instanciarMunecos(numero1, izquierda));
	yield StartCoroutine(instanciarMunecos(numero2, derecha));
		
	// Hacer que los muñecos anden al destino.
	switch (tipoOperacion) {
		case "+": operacionSuma();
			break;
		case "-":	operacionResta();
			break;
	}
	
}

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
			
			//munyecosIzq[i] = Instantiate(pref, posicion, Quaternion.identity);
			munyecosIzq[i] = GameObject.Find("munyecoIzq"+(i+1));
			munyecosIzq[i].transform.position = posicion;
			munyecosIzq[i].transform.parent = camara.transform;                         // Todos los muñecos de la izquierda son hijos de la camara AR
			munyecosIzq[i].transform.Rotate(Vector3.up*180);
			
			
			/*GameObject.Find("munyecoIzq"+(i+1)).transform.position = posicion;
			GameObject.Find("munyecoIzq"+(i+1)).transform.Rotate(Vector3.up*180);
			*/
			
			/*munyecosIzq[i] = Instantiate(pref, posicion, Quaternion.identity);
			munyecosIzqNav[i] = GameObject.Find("munyecoIzqNav"+(i+1));
			munyecosIzqNav[i].transform.position = posicion;
			munyecosIzqNav[i].transform.parent = camara.transform;                         // Todos los muñecos de la izquierda son hijos de la camara AR
			munyecosIzqNav[i].transform.Rotate(Vector3.up*180);
			
			agente[i] = munyecosIzqNav[i].GetComponent.<NavMeshAgent>(); 
			agente[i].SetDestination();
			*/
			
		}
		else {
			posicion = Vector3(coordenadas.x-40, 0, coordenadas.z);
			
			//munyecosDcha[i] = Instantiate(pref, posicion, Quaternion.identity);
			munyecosDcha[i] = GameObject.Find("munyecoDcha"+(i+1));
			munyecosDcha[i].transform.position = posicion;
			munyecosDcha[i].transform.parent = camara.transform;                         // Todos los muñecos de la derecha son hijos de la camara AR
			
			
			//GameObject.Find("munyecoDcha"+(i+1)).transform.position = posicion;
			
			/*munyecosDchaNav[i] = GameObject.Find("munyecoDchaNav"+(i+1));
			munyecosDchaNav[i].transform.position = posicion;
			munyecosDchaNav[i].transform.parent = camara.transform;                         // Todos los muñecos de la izquierda son hijos de la camara AR
			*/
		}
		
		if (desplZ)
			desplZ = 0;
		
		yield WaitForSeconds(0.75);
	}
	
}

function operacionSuma () {
	munyecosIzqNav = new GameObject[numero1];
	munyecosDchaNav = new GameObject[numero2];
	
	// Creamos los muñecos de navegacion en dos partes para que los de la primera fila se vayan moviendo antes y no haya choques.
	if (numero1 >= 3) {
		for (var i=2; i>=0; i--) {
			munyecosIzqNav[i] = GameObject.Instantiate(munyecosIzq[i], munyecosIzq[i].transform.position, munyecosIzq[i].transform.rotation);
			
			// Calcular posicion de destino para cada muñeco.
			munyecosIzqNav[i].GetComponent.<NavMeshAgent>().SetDestination(new Vector3(230, 0, 15));
			yield WaitForSeconds(1);
		}
	}
	
	yield WaitForSeconds(2);
	
	for (i=numero1-1; i>=3; i--) {
		munyecosIzqNav[i] = GameObject.Instantiate(munyecosIzq[i], munyecosIzq[i].transform.position, munyecosIzq[i].transform.rotation);
		
		// Calcular posicion de destino para cada muñeco.
		munyecosIzqNav[i].GetComponent.<NavMeshAgent>().SetDestination(new Vector3(230, 0, 15));
		yield WaitForSeconds(0.75);
	}
	
	yield WaitForSeconds(2);
	
	
	// Creamos los muñecos de navegacion en dos partes para que los de la primera fila se vayan moviendo antes y no haya choques.
	if (numero2 >= 3) {
		for (var j=2; j>=0; j--) {
			munyecosDchaNav[j] = GameObject.Instantiate(munyecosDcha[j], munyecosDcha[j].transform.position, munyecosDcha[j].transform.rotation);
			
			// Calcular posicion de destino para cada muñeco.
			munyecosDchaNav[j].GetComponent.<NavMeshAgent>().SetDestination(new Vector3(230, 0, 15));
			yield WaitForSeconds(1);
		}
	}
	
	yield WaitForSeconds(2);
	
	for (j=numero2-1; j>=3; j--) {
		munyecosDchaNav[j] = GameObject.Instantiate(munyecosDcha[j], munyecosDcha[j].transform.position, munyecosDcha[j].transform.rotation);
		
		// Calcular posicion de destino para cada muñeco.
		munyecosDchaNav[j].GetComponent.<NavMeshAgent>().SetDestination(new Vector3(230, 0, 15));
		yield WaitForSeconds(0.75);
	}
		
}

function operacionResta() {
	munyecosIzqNav = new GameObject[numero1-numero2];

	for (var i=0; i<(numero1-numero2); i++) {
		munyecosIzqNav[i] = GameObject.Instantiate(munyecosIzq[i], munyecosIzq[i].transform.position, munyecosIzq[i].transform.rotation);
		
		// Calcular posicion de destino para cada muñeco.
		munyecosIzqNav[i].GetComponent.<NavMeshAgent>().SetDestination(new Vector3(230, 0, 15));
	}	
}

function Update () {

}
