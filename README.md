# LsMusic

## Practica final hipermedia

####Desarrolladores:

* Alberto de Bofarull Olano  (ls28517)

* Andres Biarge  (ls28729)

* Roberto de Arquer  (ls28909)

---

#### Descripción de la aplicación:

La Salle Recomender es un recomendador de música. Permite buscar canciones y visualizar una vista previa de las mismas para hacerse una idea. Es meramente consultiva de manera que el usuario puede después, a partir de consultar esas preview, buscar la canción original.

Para facilitar al usuario que pueda buscar más adelante las canciones que le hayan gustado, la aplicación permite guardar en favoritos esas vistas previas. Mediante un click podrá guardar como “favoritos” y eliminar de “favoritos” esas canciones.
El usuario verá todo esto como una aplicación de una sola página web (Single Page Application). Así, lo primero que verá será una barra de navegación donde podrá introducir texto para buscar canciones relacionadas con él, sean nombres de canción, artistas o álbumes combinados de cualquier manera. 

La siguiente vista, inmediatamente inferior, es la vista de recomendados. Aquí se mostrarán las 3 ó 5 (según si el dispositivo es móvil o de tamaño mayor) canciones más escuchadas del mundo en ese momento. Mostramos la imagen del artista, su nombre y el título de la canción en cuestión.

A continuación se pueden ver los resultados de la búsqueda del usuario (nada, si no se ha buscado nada), los favoritos y los diseñadores web (nos hemos querido mostrar en la aplicación). Estas vistas siguen el esquema “ListView” que hemos tomado de haber trabajado en Android.  Así, cada canción, ya sea resultado de una búsqueda o guardada como favoritos, dispone de una imagen, detalles de la canción (nombre, álbum y artista) y botones de play/pause y de interacción con el contenedor. Estos últimos botones pueden ser dos: una estrella o una papelera.

La estrella es el botón de interacción con la vista de resultados de búsqueda. Si al usuario le gusta esa canción, puede añadirla a favoritos haciendo click en la estrella de esa canción. Una canción guardada en favoritos se puede eliminar de esa lista haciendo click en el botón papelera.

Como añadido, también se ve en todo momento una estrella ubicada en la esquina inferior derecha que se superpone a todo en la vista de la aplicación. Un click en esa estrella lleva la vista a la ListView de favoritos.
