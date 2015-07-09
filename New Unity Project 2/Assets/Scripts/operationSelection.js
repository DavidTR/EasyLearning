#pragma strict

@HideInInspector
var hit : RaycastHit;															// Objeto con el que colisiona el rayo.
@HideInInspector
var dataInputForm: GameObject;										// Formulario que servira para recibir los datos sobre la operacion.
@HideInInspector
var dataIn: boolean;													// ¿Estamos recogiendo datos?
private var targetPosition: Vector3;
@HideInInspector
static var tipoOp: String;
@HideInInspector
var operacionSeleccionada : boolean;

function Start () {
	dataInputForm = GameObject.Find("operationDataInput");
	dataIn = false;
	operacionSeleccionada = false;
	targetPosition = Vector3(0,-5,10);
}

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
       
    // PRUEBAS EN PC
	if (Input.GetButtonDown("Fire1") && !dataIn) {
		var ray = Camera.main.ScreenPointToRay(Input.mousePosition);

       if (Physics.Raycast(ray, hit, 100)) {
	       	if (hit.collider.gameObject.name == "addOperation") {
	           
	            if (!operacionSeleccionada) {
	            	adjustDataInput();
	            	 tipoOp = "+";
	            }
	         }
	         else 	if (hit.collider.gameObject.name == "substractOperation") {

	            if (!operacionSeleccionada) {
	            	adjustDataInput();
	            	tipoOp = "-";
	            }
	         }
	         // Para añadir mas operaciones, agregar botones extra aqui.
        }
	}
}

function OnGUI() {
	
}

function adjustDataInput () {
	while (true) {
			dataInputForm.transform.position.y += Time.deltaTime*3.5;
	
			if (dataInputForm.transform.position.y >= targetPosition.y)
				break;	
			
			yield WaitForSeconds(0.0001);
	}
		
	dataIn = true;
	operacionSeleccionada = true;
}