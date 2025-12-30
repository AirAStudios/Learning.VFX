# Learning.VFX

## A site designed around enabling teachers to teach better through bespoke interactive teaching resources.
### Video Demo:  <URL HERE>
### Explanation and Description:
#### Python:
##### app.py:
Contains all of the basic code for running the web server. Allows for the implementation of a database and login features, as well as the use of templates for more efficient html.
The first 3 routes all use the same subroutine which I will explain shortly.
The login and register subroutines are both very similar to the subroutines used in Problem Set 9, aside from a few minor changes, and allow the user to register for and log into an account.

##### app_functions.py:
Contains the favourites() subroutine which handles the app functionality of index, chemistry and chem1. It takes the route of a page, the name, html location and the colour of the text as input and is used to allow the favouriting of pages, and the viewing of said favourites. If a post method is used, the program favourites or unfavourites the current route, or if a get method was used, it displays all the favourites and sends them to a template. 
I decided to use a subprogram to allow for myself to repeat a lot of code without copying and pasting. The choice to create the subprogram in a different file was to create a storage area for not just this subprogram, but others I may develop in the future.

#### /Templates
##### Layouts:
I originally began with a singular layout for each html template, but soon realised that it lead to a lot of redundant areas of code, as I essentially wanted two different variants that I could use for two different types of files. For example, lines 29-105 would be completely unneeded for many of my html files, as favourites are not incorporated into the login or register pages. I made sure to use lots of {% blocks %} to account for the many bespoke changes that each of the html files would receive.

##### CSS Files:
You may notice that I have many (sometimes even 5!) different css stylesheets attached to each html file. This is to allow for modularity, as certain css properties are can be shared between different files, others cannot, but often specific segments can be shared between 2 or 3 different files. This reduces any code repetition, while still keeping the design flexibility between pages.

#### Key features of templates:
##### Select bar:
This was perhaps the first major element I created for this project, and I began designing it even before finishing Problem Set 8 which made it even more challenging! It was here that I first incorporated the 'hover' effect, which I thought made the web app more fun and interesting to use. Originally I had all the options appear on hover, but later I came back to the select bar to make it so the menu only drops down when it is clicked.

##### Dropdown menu:
This was one of the early challenges I faced when starting my final project. I wanted the flexibility of my own system for the menu, but I also didn't want to waste too much time on small design details. I used three pill shapes to create the hamburger icon, and then used a script to toggle between the 'active' properties of each <div> item which contained the class "drop". Here I utilised many 'hover' and 'active' transitions to add more interactivity and fun to my web app.

##### 3D models:
This was definitely the most difficult part of my final project. As a 3D animator, I really wanted to create some kind of interactive animation, and in my short research I found three.js, which is a javascript library that enables one to import and animate 3D models on the web. 
The 3D elements on the homepage acted as a simple starting point to help me learn about three js, before moving onto more difficult creations.
For the homepage, I learned how to make a cube, how to import 3D models from Blender (my 3D software of choice) using a GLTF loader and how to light a scene using three's primitive base lights. After this, for the homepage, all that was needed was repositioning and rotating of the objects. 

Prior to creating the select_bar, I created some concept images on Davinci Resolve of how my website homepage and chemistry homepage could look. This helped me know exactly what I wanted to make and how I wanted it to look without needing to know how I would actually make it. (I have added these to a folder called concept_images if you are interested).
These images had a great depiction of the L shaped blocks in different orientation, which aided me greatly in my positioning and rotating of the objects in my real scene. Knowing where the objects should be and how they should be rotated made it much easier. This also came in very handy when I was doing the lighting for the scene, as I could just copy the lighting I used in my Blender file.
The final part of the homepage was to add some subtle animation ot the 3D objects, some responsive design features and to disable the use of the cursor to rotate around the scene.

#### /static
Favicon:
I created my favicon in Davinci Resolve, and used favicon.io to convert my png into a variety of different formats for different platforms.

##### Chem1.scene.js:
This contains the code for the main tool present in my web app (though definitely not the last), which features two different molecules which can be viewed from different angles in 3D. Each molecule also has spheres representing each of its atoms' electronegativity which can be toggled on and off, or viewed with different colourisation.
The 3D models of methane and fluoromethane were created using PyMol and Blender with the Atomic Blender Extension.
To easily send data about which material corresponded to each atom type, I used the emission colour as a sort of code. e.g. 210000 for Hydrogen, and these materials were easily loaded in using a GLTF Loader.
There are two colour options present in the final product: hue and value colourisation.
Hue colourisation is created using a gradient with 4.0 (Fluorine) being Red and 0.0 being blue. The other atoms can then be plotted according to their electronegativities, giving a unique hex value for each atom. For the value colourisation a similar approach was used, except ranging from black (Fluorine) to white. 
In order to allow the user to switch between these two views I created simple UI tools such as an opacity slider, molecule selector and colourisation mode buttons.

Hiding the spheres:
This was the most simple of the UI features, but did involve the creation of a new subroutine (found in js_functions.js) which creates an event.listener, toggles active on the required elements and performs 2 different functions based on the active state of the aforementioned elements.

Changing the sphere colour schemes:
In order to change the colour of the spheres, one has to change the material of each mesh within that model, and set it's hex value. In order to do this, I created another subroutine: change_colour which takes as input the model to be changed, the new opacity and the type of colour (greyscale=0, hue=1). An array stores the two colours for each atom, and uses the emission colour to determine which material corresponds to each atom.

Changing molecules:
This, for me, was the most difficult part of the final project. It sounds very simple, but combining the changing of all the files, with the need retain the colour schemes and visibility already created ended up making it much more difficult than first meets the eye. After creating my subprogram program which allowed for changing the visibility and colours of the methane, I attempted to make minor changes to the program in order to accommodate a new object type. I encountered many bugs, including ui not working and incorrect rendering, and had to create new subprograms and new global variables in order to deal with them.

Thank you for taking the time to check out Learning.VFX!