#pragma strict
import System.Text.RegularExpressions;

var pref : GameObject;
var camara : GameObject;
var onlyNumbers1 : String;
var onlyNumbers2 : String;
var insertado : int = 0;

function Start () {
    //objeto.transform.position = Vector3 (x, y, 0);
}

function Update () {
	if(insertado){
		var vector = new Array(4);
		vector[0] = Vector3(50, 0, 50);
		vector[1] = Vector3(50, 0, -50);
		vector[2] = Vector3(-50, 0, 50);
		vector[3] = Vector3(-50, 0, -50);
		for(var i = 0 ; i < vector.length ; i++){	
			var objeto = Instantiate(pref, vector[i], Quaternion.identity) as GameObject;
			objeto.transform.parent = camara.transform;
		}
		insertado = 0;
	}
}

function OnGUI() {
	onlyNumbers1= GUI.TextField(new Rect(30, 110, 30, 20), onlyNumbers1, 3);
	onlyNumbers1= Regex.Replace(onlyNumbers1, "[^0-9]", "");
	
	onlyNumbers2= GUI.TextField(new Rect(110, 190, 30, 20), onlyNumbers2, 3);
	onlyNumbers2= Regex.Replace(onlyNumbers2, "[^0-9]", "");
	
	if (GUI.Button(new Rect(30, 220, 50, 30), "Click"))
       insertado = 1;
}