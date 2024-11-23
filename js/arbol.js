const texto_catalogo = document.getElementById("texto_catalogo");
const input_nombre = document.getElementById("input_nombre");
const input_nombre_otro = document.getElementById("input_nombre_otro");
const input_autor = document.getElementById("input_autor");
const input_ano = document.getElementById("input_ano");
const boton_enviar = document.getElementById("enviar");
const boton_buscar = document.getElementById("buscar");
const boton_eliminar = document.getElementById("eliminar");
const boton_in_order = document.getElementById("in_order");
const boton_pre_order = document.getElementById("pre_order");
const boton_post_order = document.getElementById("post_order");
const boton_arbol = document.getElementById("arbol");

let notificacion_eliminar = false;

boton_enviar.addEventListener("click", function() {
    if (input_nombre.value.trim() !== "" && input_autor.value.trim() !== "" && input_ano.value > 0){
        insertar_catalogo(input_nombre.value, input_autor.value, input_ano.value);
    } else {
        alert("Por favor, ingrese texto valido");
    }
});

boton_buscar.addEventListener("click", function() {
    if (input_nombre_otro.value.trim() !== ""){
        if (biblioteca.buscar(input_nombre_otro.value)) {
            alert(`El libro "${input_nombre_otro.value}" está disponible.`);
        } else {
            alert(`No se ha encontrado el libro llamado "${input_nombre_otro.value}"`);
        }
    } else {
        alert("Por favor, ingrese texto valido");
    }
});

boton_eliminar.addEventListener("click", function() {
    if (input_nombre_otro.value.trim() !== ""){
        if (biblioteca.buscar(input_nombre_otro.value)) {
            biblioteca.eliminar(input_nombre_otro.value)
            alert(`El libro "${input_nombre_otro.value}" se ha eliminado correctamente.`);
            actualizar_catalogo();
            notificacion_eliminar = false;
        } else {
            alert(`No se ha encontrado el libro llamado "${input_nombre_otro.value}"`);
        }
    } else {
        alert("Por favor, ingrese texto valido");
    }
});

boton_in_order.addEventListener("click", function() { 
    texto_catalogo.innerHTML = biblioteca
        .recorrer_en_orden()
        .replace(/\n/g, "<br>");  
});
boton_pre_order.addEventListener("click", function() {
    texto_catalogo.innerHTML = biblioteca
        .recorrer_pre_orden()
        .replace(/\n/g, "<br>");  
});
boton_post_order.addEventListener("click", function() {
    texto_catalogo.innerHTML = biblioteca
        .recorrer_post_orden()
        .replace(/\n/g, "<br>");  
});
boton_arbol.addEventListener("click", function() {
    actualizar_catalogo();
});

function insertar_catalogo(nombre, autor, ano){
    let nuevo_libro = {
        "Nombre": nombre,
        "Autor": autor,
        "Año de publicación": ano,
    };
    biblioteca.insertar(nuevo_libro);
    actualizar_catalogo()
}

function actualizar_catalogo(){
    texto_catalogo.innerHTML = biblioteca
        .representacion_visual()
        .replace(/ /g, "&nbsp;") 
        .replace(/\n/g, "<br>"); 
}


class Nodo {
    constructor(valor) {
        this.valor = valor; 
        this.izquierdo = null; 
        this.derecho = null;  
    }
}

class Arbol_Binario {
    constructor() {
        this.raiz = null; 
    }

    insertar(valor) {
        const nuevo_nodo = new Nodo(valor);
        if (!this.raiz) {
            this.raiz = nuevo_nodo;
        } else {
            this.insertar_comprobar(this.raiz, nuevo_nodo);
        }
    }
    insertar_comprobar(nodo, nuevo_nodo) {
        if (nuevo_nodo.valor.Nombre < nodo.valor.Nombre) {
            if (!nodo.izquierdo) {
                nodo.izquierdo = nuevo_nodo;
            } else {
                this.insertar_comprobar(nodo.izquierdo, nuevo_nodo);
            }
        } else {
            if (!nodo.derecho) {
                nodo.derecho = nuevo_nodo;
            } else {
                this.insertar_comprobar(nodo.derecho, nuevo_nodo);
            }
        }
    }

    buscar(valor) {
        return this.buscar_comprobar(this.raiz, valor);
    }
    buscar_comprobar(nodo, valor) {
        if (!nodo) return false;
        if (valor === nodo.valor.Nombre) {
            let resultado = "- Nombre del libro: " + nodo.valor.Nombre +
                "\n- Autor: " + nodo.valor.Autor +
                "\n- Año de publicación: " + nodo.valor["Año de publicación"];
                
            texto_catalogo.innerHTML = resultado
                .replace(/\n/g, "<br>"); 

            return true
        };
        if (valor < nodo.valor.Nombre) {
            return this.buscar_comprobar(nodo.izquierdo, valor);
        } else {
            return this.buscar_comprobar(nodo.derecho, valor);
        }
    }

    eliminar(valor) {
        this.raiz = this.eliminar_comprobar(this.raiz, valor);
    }
    eliminar_comprobar(nodo, valor) {
        if (!nodo){ 
            return null;
        }
        if (valor < nodo.valor.Nombre) {
            nodo.izquierdo = this.eliminar_comprobar(nodo.izquierdo, valor);
            return nodo;
        } else if (valor > nodo.valor.Nombre) {
            nodo.derecho = this.eliminar_comprobar(nodo.derecho, valor);
            return nodo;
        } else {
    
            if (!nodo.izquierdo) return nodo.derecho;
            if (!nodo.derecho) return nodo.izquierdo;

            const nodo_minimo = this.encontrar_nodo_min(nodo.derecho);
            nodo.valor = nodo_minimo.valor;
            nodo.derecho = this.eliminar_comprobar(nodo.derecho, nodo_minimo.valor);
            return nodo;
        }
    }

    encontrar_nodo_min(nodo) {
        while (nodo.izquierdo) {
            nodo = nodo.izquierdo;
        }
        return nodo;
    }

    recorrer_en_orden(nodo = this.raiz) {
        let resultado = ""; 
    
        if (nodo) {
            resultado += this.recorrer_en_orden(nodo.izquierdo);
            resultado += `- ${nodo.valor.Nombre}\n`; 
            resultado += this.recorrer_en_orden(nodo.derecho);
        }
        return resultado; 
    }
    recorrer_pre_orden(nodo = this.raiz) {
        let resultado = ""; 

        if (nodo) {
            resultado += `- ${nodo.valor.Nombre}\n`; 
            resultado += this.recorrer_pre_orden(nodo.izquierdo);
            resultado += this.recorrer_pre_orden(nodo.derecho);
        }
        return resultado; 
    }
    recorrer_post_orden(nodo = this.raiz) {
        let resultado = ""; 
    
        if (nodo) {
            resultado += this.recorrer_post_orden(nodo.izquierdo);
            resultado += this.recorrer_post_orden(nodo.derecho);
            resultado += `- ${nodo.valor.Nombre}\n`; 
        }
        return resultado; 
    }

    representacion_visual(nodo = this.raiz, char1 = " > ", char2 ="|") {
        if (!nodo) return ""; 

        let resultado = `${char1}${char2}${nodo.valor.Nombre}, ${nodo.valor.Autor}, ${nodo.valor["Año de publicación"]}${char2}\n`;
        
        resultado += this.representacion_visual(nodo.derecho, "    " + char1);
        resultado += this.representacion_visual(nodo.izquierdo, "    " + char1);
    
        return resultado;
    }     
}

const biblioteca = new Arbol_Binario();


// let libro1 = {
//     "Nombre": "El Quijote",
//     "Autor": "Miguel de Cervantes",
//     "Año de publicación": 1605,
// };

// let libro2 = {
//     "Nombre": "El Señor de los Anillos",
//     "Autor": "J.R.R. Tolkien",
//     "Año de publicación": 1954,
// };

// let libro3 = {
//     "Nombre": "Harry Potter y el Prisionero de Azkaban",
//     "Autor": "J.K. Rowling",
//     "Año de publicación": 1999,
// };

// let libro4 = {
//     "Nombre": "2001 Odisea en el espacio",
//     "Autor": "Arthur C. Clarke",
//     "Año de publicación": 1968,
// };

// let libro5 = {
//     "Nombre": "Cien Años de Soledad",
//     "Autor": "Gabriel García Márquez",
//     "Año de publicación": 1967,
// };

// let libro6 = {
//     "Nombre": "La historia del culo",
//     "Autor": "Juan José Saer",
//     "Año de publicación": 1992,
// };

// let libro7 = {
//     "Nombre": "Guía de supervivencia",
//     "Autor": "Christopher McDougall",
//     "Año de publicación": 2009,
// };

// let libro8 = {
//     "Nombre": "50 sombras de Grey",
//     "Autor": "E.L. James",
//     "Año de publicación": 2009,
// };

// biblioteca.insertar(libro1);
// biblioteca.insertar(libro2);
// biblioteca.insertar(libro3);
// biblioteca.insertar(libro4);
// biblioteca.insertar(libro5);
// biblioteca.insertar(libro6);
// biblioteca.insertar(libro7);
// biblioteca.insertar(libro8);