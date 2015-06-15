#pragma strict

@HideInInspector
var operationSelect : operationSelection;
@HideInInspector
var mostrarBotones : boolean;
@HideInInspector
var operando1 : String;
@HideInInspector
var operando2 : String;
@HideInInspector
static var num1: int;
@HideInInspector
static var num2: int;
@HideInInspector
var numerosEnRango : boolean;
@HideInInspector
var ventanaAviso : Rect;


function Start () {
	operationSelect = Camera.main.GetComponent.<operationSelection>();
	
	// Tamaño de la ventana de aviso de numeros fuera de rango.
	ventanaAviso = new Rect(Screen.width/2-125, Screen.height/2-25, 250, 50);
	numerosEnRango = true;
}

function Update () {
	if (operationSelect.dataIn) {
		mostrarBotones = true;
		operationSelect.dataIn = false;
	}
}

function OnGUI() {
	if (mostrarBotones) {
			
		operando1 = GUI.TextField(new Rect(Screen.width/3.5 , Screen.height/1.3+5, 40, 20), operando1, 3);
		operando1 = Regex.Replace(operando1, "[^0-9]", "");
		
		operando2 = GUI.TextField(new Rect(Screen.width/1.9 , Screen.height/1.3+5, 40, 20), operando2, 3);
		operando2 = Regex.Replace(operando2, "[^0-9]", "");
		

				
		// Hacer estas coordenadas independientes de la pantalla (relativas a algun objeto del mundo).
		if (GUI.Button(new Rect(Screen.width/1.55 , Screen.height/1.3, 50, 30), "=") && numerosEnRango) {
			num1 = int.Parse(operando1);
			num2 = int.Parse(operando2);
			if (num1 < 0 || num1 > 5 || num2 < 0 || num2 > 5)
				numerosEnRango = false;
			else 
				Application.LoadLevel("AROperations");
				
			print("=");
		}
		
		// Si los numeros no estan en el rango correcto se muestra un error.
		if (!numerosEnRango)
			ventanaAviso = GUILayout.Window (0, ventanaAviso, rellenarVentana, "Error: Numeros fuera de rango");
		
		if (GUI.Button(new Rect(Screen.width/2.45 , Screen.height/1.3, 40, 30), operationSelection.tipoOp))
			print("+");
	}
}

// Esta funcion dice lo que la ventana de aviso va a llevar en su interior. Es un simple boton.
function rellenarVentana (indice: int) {

	// Aqui deberia ir un Aceptar, pero es necesario un padding para incluir este mensaje en la ventana, no en el boton. Investigar.
	if (GUILayout.Button (" Introduce numeros entre 0 y 5"))
		numerosEnRango = true;
}