#pragma strict
import System.Text.RegularExpressions;


var pref : GameObject;       // El prefab que entra como parametro, del que se instancian las copias
var camara : GameObject;     // La camara AR
@HideInInspector
var posicion : Vector3[];    // Posicion de inicio de los muñecos
@HideInInspector
var munyecosIzq : GameObject[]; // Vector de instancias de muñecos
@HideInInspector
var munyecosDcha : GameObject[]; // Vector de instancias de muñecos
@HideInInspector
var agente : NavMeshAgent[]; // Vector de componentes NavMeshAgent de cada muñeco (replicados de prefab)
@HideInInspector
var yaEsta : int = 0;
@HideInInspector
var numero1 : int;
@HideInInspector
var numero2 : int;
@HideInInspector
var tipoOperacion : String;
private var izquierda : int = 0;
private var derecha : int = 1;


function Start () {

	// Recogemos los numeros introducidos por el usuario.
	//numero1 = dataInput.num1;
	//numero2 = dataInput.num2;
	
	numero1 = 6;
	numero2 = 5;
	
	// Reservamos espacio para los arrays de muñecos.
	munyecosIzq = new GameObject[numero1];
	munyecosDcha = new GameObject[numero2];
	
	// Adicionalmente se recoge el tipo de operacion.
	tipoOperacion = operationSelection.tipoOp;
	
	// Instanciamos todos los muñecos de la escena.
	instanciarMunecos(numero1, izquierda);
	instanciarMunecos(numero2, derecha);
	
	yaEsta = 1;
}

function instanciarMunecos (numMunecos : int, lado : int) {
	
	var coordenadas : Vector3;
	
	// Instanciamos los muñecos de ambos lados, los guardamos en su respectivo array de munyecos.
	var desplZ = 0;
	var desplX : int;
	var posicion : Vector3;
	
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
			
			munyecosIzq[i] = Instantiate(pref, posicion, Quaternion.identity);
			munyecosIzq[i].transform.parent = camara.transform;                         // Todos los muñecos son hijos de la camara AR
		}
		else {
			posicion = Vector3(coordenadas.x-40, 0, coordenadas.z);
			
			munyecosDcha[i] = Instantiate(pref, posicion, Quaternion.identity);
			munyecosDcha[i].transform.parent = camara.transform;                         // Todos los muñecos son hijos de la camara AR
		}
		
		if (desplZ)
			desplZ = 0;
		
		yield WaitForSeconds(1);    
	}
}

function Update () {
	//if(yaEsta) Mover();
}
/* Diferenciar entre los dos arrays.
function Mover() {
	agente = new NavMeshAgent[4];
	var target : Vector3;
	var x : int;
	var y : int;
	var z : int;
	
	for(var i = 0 ; i < 4 ; i++){
		agente[i] = munyecos[i].GetComponent.<NavMeshAgent>();                   // Obtencion del componente NavMeshAgent de cada muñeco
		x = posicion[i].x;
		y = posicion[i].y;
		z = posicion[i].z + 180;
		target = new Vector3(x, y, z);
		agente[i].SetDestination(target);                                        // Destino del componente NavMeshAgent
		yield WaitForSeconds(1);                                                // Retraso al comenzar a moverse hacia el destino
	}
}*/