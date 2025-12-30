# Learning.VFX
## A site designed around enabling teachers to teach better through bespoke interactive teaching resources.
## Video Demo:  <URL HERE>
### Explaination and Description:
#### Python:
app.py:
Contains all of the basic code for running the web server. Allows for the implementation of a database and login features, as well as the use of templates for more efficient html.
The first 3 routes all use the same subroutine which I will explain shortly.
The login and register subroutines both offer logic which provides the user to register and login to an account - note this code is very similar to code from Problem Set 9: Finance.

app_functions.py:
Contains the favourites() subroutine which takes the route of a page, the name, html location and the colour of the text. If a post has been sent, it favourites or unfavourites the route, or if a get method was used, it displays all the favourites and sends them to a template. 
I decided to use a subprogram to allow for myself to repeat a lot of code without copying and pasting. The choice to create the subprogram in a different file was in preparation for any other subprograms I might need to creat in the future.

#### /Templates
Layouts:
I originally began with a singular layout for each html template, but soon realised that it lead to a lot of redundant areas of code, as I essentially wanted two different variants that I could use for different html files. For example, lines 29-105 would be completely unneeded for many of my html files, making them a waste of space.
In my layouts I created lots of space for different {%blocks%} which allowed me to use these layouts even if the html files differed.

CSS Files:
You may notice that I have many (sometimes even 5!) css stylesheets attached to each html file. This is to allow for some modularity, as certain css properties are can be shared between different files, but also allows flexibility to change css files without worrying about it affecting others.

Key features of templates:
Dropdown menu:
This was one of the early challenges I faced when starting my final project. I wanted the flexibility of my own system for the menu, but I also just wanted to try creating one for myself. I used three pill shapes to create the hamburger icon, and then used a script to toggle between the 'active' properties of each <div> item with the class "drop". I had a lot of fun creating interactive animations on hover and active with transitions to make the website feel more responsive and fun!

Select bar:
This was perhaps the first major creating I did with this project, and I actually started it before finishing Problem Set 8 which made it even more challenging! It was here that I first incoporated the 'hover' effect, which was a lot of fun! Originally I had all the options appear on hover, but later I can back to make it so the menu only drops down when it is clicked.

3D models:
This was definently the most difficult part of my final project. As a 3D animator, I really wanted to create some kind of interactive animation, and in my short research I found three.js (which has some lovely tutorials on their website if you're interested) which enables one to import and animate 3D models on the web. 
After figuring out how to make a cube, I then moved on to importing 3D models from Blender (my 3D software of choice) using a GLTF loader. 
After this, for the hompage, all that was needed was repositioning and rotating of the objects. 
Prior to making and positioning the objects, I created some concept images on Davinci Resolve of how my website homepage and chemistry homepage could look. This helped me know exactly what I wanted to make and how I wanted it to look without needing to know how to create it in reality. (I have added these to a folder called concept_images if you are interested).
Knowing where the objects should be and how they should be rotated made it much easier to rotate and move them in the real project. This also came in very handy when I was doing the lighting for the scene, as I could just copy what I created in my Blender file (I created images of the L shaped blocks in Blender which I then exported to Davinci Resolve for the concept image).
The final part was to add some subtle animation, some reponsive design features and to disable the use of the cursor to rotate around the scene.

#### /static
Favicon:
I created my favicon in Davinci Resolve, which was a very fun process. After some research, it appeared favicon.io was a very good website to convert one's image into a multitude to befit all device types.

##### JS: 
Intro: 
This js contains the code for the affomentioned homepage three.js file, but also the chem1.scene.js file - which ended up take up the most of my time.
The idea was to have a set of 2 molecules which one could view, and optionally toggle the spheres for their effect. First came the 3D models of the molecules (I chose methane and flouromethane as a simple start) which I created with PyMol (free software) and the Atomic Blender Extension. I then cleaned up the moleulces, converted them to meshes and outputted them. In order to have a way of differentiaing the materials of each part of the molecule, I used the emission colour as a sort of code, for example 210000 for Hydrogen. This allowed me to change the colour per atom even in runtime.
I then imported the models, but found the GLTF Loader I had used for the homepage was not suitable for all I wanted to do - so I had to make some modifications.
I created some UI features (buttons, sliders etc.) to sit on top of the 3D scene to provide some interactive controls to the user. This includes changing the opacity, colour and visibility of the influence spheres and the molecule being displayed.
I found that including the event.listener insdie the loader function was the easiest way to avoid the problem of not being able to access the local variable 'model' outside the object.
Note: other than the objects in the scene, the homepage and the chem1 scene contain the exact same camera and render settings!

Hiding the spheres:
This was the most simple of the UI features, but did involve the creation of a new subroutine (found in js_functions.js) which creates an event.listener, toggles active on the required elements and performs 2 different functions based on the active state of the afformentioned elements.

Changing the sphere colour schemes:
I knew I wanted to represent the electronegativities of the different atoms in a visual way, and came up with two different methods for acomplishing this: changing the brightness of the colour, and changing the hue. I could imagine that each may be a better representation for different molecules, so I implemented both. 
This involed the creation of another subroutine: change_colour which takes as input the model to be changed, the new opacity and the type of colour (greyscale=0, hue=1). An array stores the two colours for each atom, and uses the emmision colour to determine which material corrosponds to each atom.

Changing molecules:
This, for me, was the most difficult part of the final project. It sounds very simple, but combining the changin of all the files, with the need to keep it inside the function, and also retain the colour schemes and visibility already created ended up making it much more difficult than meets the eye on first glance. After creating my subprogram program which allowed for changing the visibility and colours of the methane, I attemped to make minor changes to the program in order to accomodate a new object type. I tried to differentiate the objects, and there were many bugs involving the ui, and data not correctly outputing, but I managed to create a bug free version. Unfortunately this envolved copy and pasting my code to create two slightly different sub-programs. After wards, I found a way to combine it all into a singular subprogram, retaining all of the funcitonality.

#### Other
Github:
I originally creatd a new git hub account (animation-edu) thinking that I would need a seperate account for my web_app to seem professionally created. Turns out this was completely unnecessary!
