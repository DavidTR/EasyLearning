#pragma strict
import System.Text.RegularExpressions;

var pref : GameObject;       // El prefab que entra como parametro, del que se instancian las copias
var camara : GameObject;     // La camara AR
var onlyNumbers1 : String;   // Entrada numerica 1
var onlyNumbers2 : String;   // Entrada numerica 2
var posicion : Vector3[];    // Posicion de inicio de los muñecos
var munyecos : GameObject[]; // Vector de instancias de muñecos
var agente : NavMeshAgent[]; // Vector de componentes NavMeshAgent de cada muñeco (replicados de prefab)
var insertado : int = 0;
var yaEsta : int = 0;

function Start () {
	posicion = new Vector3[4];
	munyecos = new GameObject[4];
	posicion[0] = Vector3(50, 0, -50);
	posicion[1] = Vector3(50, 0, -150);
	posicion[2] = Vector3(-50, 0, -50);
	posicion[3] = Vector3(-50, 0, -150);

    for(var i = 0 ; i < 4 ; i++){
    	munyecos[i] = Instantiate(pref, posicion[i], Quaternion.identity);
		munyecos[i].transform.parent = camara.transform;                         // Todos los muñecos son hijos de la camara AR
		yield WaitForSeconds(1);                                               // Retraso en la instanciacion entre muñecos
	}
	
	yaEsta = 1;
}

function Update () {
	if(yaEsta) Mover();
}

function OnGUI() {
	onlyNumbers1= GUI.TextField(new Rect(30, 110, 30, 20), onlyNumbers1, 3);
	onlyNumbers1= Regex.Replace(onlyNumbers1, "[^0-9]", "");                      // Exp. regular solo para numeros
	
	onlyNumbers2= GUI.TextField(new Rect(110, 190, 30, 20), onlyNumbers2, 3);
	onlyNumbers2= Regex.Replace(onlyNumbers2, "[^0-9]", "");                      // Exp. regular solo para numeros
	
	if (GUI.Button(new Rect(30, 220, 50, 30), "Click") && !yaEsta)
       insertado = 1;
}

function Mover(){
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
}