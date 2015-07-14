#pragma strict

/**
	operationSelection script: Here the operation selection action in the application is supervised.
**/

private var hit : RaycastHit;													// Object hit with the collisiion ray.
private var dataInputForm: GameObject;								// Form user will use to introduce the operands.
@HideInInspector
static var insertarDatos: boolean;											// Controls if we are reading data from the dataInput form or not.
private var posicionFinal: Vector3;											// Position where the insertarDatosput form will be positioned.
@HideInInspector
static var tipoOp: String;														// Operation selected by the user.
@HideInInspector
static var operacionSeleccionada : boolean;							// Controls if the user chooses an operation.

/**
	Start function: Initializes the references to the dataInput form, some boolean variables and the target position of the said form.
**/
function Start () {
	dataInputForm = GameObject.Find("operationDataInput");
	insertarDatos = false;
	operacionSeleccionada = false;
	posicionFinal = Vector3(0,-5,10);
}

/**
	Update function: Checks if the user chooses an operation.
**/
function Update () {

	// HABILITAR PARA TACTIL
	/*var touches = Input.touchCount;
	
	if (touches > 0) {
	
		var touch = Input.GetTouch(0);
	   
	   var ray = Camera.main.ScreenPointToRay(Input.GetTouch(0).position);
	   
       if (Physics.Raycast(ray, hit, 100)) {
            print("User tapped on game object " + hit.collider.gameObject.name);
        }
    }
       */     
  
	if (Input.GetButtonDown("Fire1") && !insertarDatos) {
		var ray = Camera.main.ScreenPointToRay(Input.mousePosition);

       if (Physics.Raycast(ray, hit, 100)) {
	       	if (hit.collider.gameObject.name == "addOperation") {
	           
	            if (!operacionSeleccionada) {
	            	ajustarDataInput();
	            	 tipoOp = "+";
	            }
	         }
	         else if (hit.collider.gameObject.name == "substractOperation") {

	            if (!operacionSeleccionada) {
	            	ajustarDataInput();
	            	tipoOp = "-";
	            }
	         }
	         else if (hit.collider.gameObject.name == "exitButton") {
	         	print("Salir");
	            Application.Quit();
	         }
        }
	}
}

/**
	AjustarDataInput function: Moves the dataInput form to its target position.
**/
function ajustarDataInput () {
	while (true) {
			dataInputForm.transform.position.y += Time.deltaTime*3.5;
	
			if (dataInputForm.transform.position.y >= posicionFinal.y)
				break;	
			
			yield WaitForSeconds(0.0001);
	}
		
	insertarDatos = true;
	operacionSeleccionada = true;
}