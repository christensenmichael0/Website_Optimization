#Front-End Web Developer Nanodegree Project 4 -- Website Optimization
Michael Christensen
March 2017

####Objectives:
--------------
One objective of this project was to improve google insights page speed score of index.html
to above 90 for both mobile and desktop. A second objective was to remove jank from views/pizza.html
to get a consistent 60 fps when scrolling. Finally, I was tasked with improving computational efficiency
on the pizza.html page inorder to get the time to resize pizzas below 5ms when using the resizer slider bar.

####Initial Steps:
--------------
Go to Github and clone "frontend-nanodegree-mobile-portfolio" from Udacity -- I will be optimizing files within these folders 

####File Structure:
---------------
src: update code for optimization -- these are the expanded working files with comments
dist: production ready outputfiles after running grunt -- minified html/css, uglified js, resized/compressed images

####Setting up my local server:
----------------------------
1.) Install python and open the command line

$> cd /path/to/your-project-folder
$> python -m SimpleHTTPServer 8080

2.) Download ngrok to create a secure tunnel to my local server then install into the project directory

$> cd /path/to/your-project-folder
$> ngrok http 8080

Point browser to the forwarding url found in the command window (later use this url for PageSpeed Insights).

3.) Setup Grunt environment to optimize files (uglify JavaScript, minify/concatenate css, resize/compress images
Install NodeJS and install the gruntCLI to get the grunt command line interface.

npm install -g grunt-cli 

4.) Create a package.json file, which is a special file that node uses to track dependencies on a project.

$> npm  init

5.) Add grunt as one of our developer dependencies. 

$> npm install --save-dev grunt

6.) Set up Gruntfile.js

$> npm install grunt-contrib-clean grunt-contrib-copy grunt-inline grunt-contrib-uglify grunt-contrib-htmlmin grunt-contrib-tinyimg --save-dev

####Improve Google Pagespeed Insights Score
--------------------------------------

- Use grunt-inline plugin to inline and minify CSS in development code (dist/index.html)
- Define media="print" attribute for print.css since it does not always need to be loaded.
- Minify perfmatters.js and analytics.js and also include async attribute to prevent render blocking. 
  This can be done since the scripts don't modify the DOM or CSSOM.
- Use grunt-contrib-htmlmin plugin to minify html.
- Use grunt-responsive-images and grunt-tinyimg to optimally size and compress images
- In index.html (homepage) deploy width and height attributes within the img tag for improved performance
  '''
  <img style="width: 100px; height: 50px;" src="...">
  '''

*Before Optimization-index.html*
Mobile 27/100
Desktop 29/100

*After Optimization-index.html*
Mobile 93/100
Desktop 92/100

####Improve Performance of sliding pizzas in pizza.html
----------------------------------------------------

1.) In the pizzaElementGenerator function in views/main.js:

- Use a compressed version of the original pizza.png file (20.6 KB vs 48.7 KB)

2.) In function determineDX in views/main.js:

- Use getElementById instead of querySelector since it is faster -    
```
// var windowWidth = document.querySelector("#randomPizzas").offsetWidth;
var windowWidth = document.getElementById("randomPizzas").offsetWidth;
```


3.) In function changePizzaSizes in views/main.js:

- Create randomPizzaContainer array variable that references all elements with classname randomPizzaContainer
```	
var randomPizzaContainer = document.getElementsByClassName("randomPizzaContainer");
```	

- Determine the length of the randomPizzaContainer array
```
var randomPizzaContainerLength = randomPizzaContainer.length;
```	

- Pull dx and newwidth from for loop to prevent forced synchronous layout
```	
var dx = determineDx(randomPizzaContainer[0], size);
	
var newwidth = (randomPizzaContainer[0].offsetWidth + dx) + 'px';
```
4.) In function updatePositions in views/main.js:

- Use getElementsByClassName instead of querySelectorAll to improve perfomance -
```
  var items = document.getElementsByClassName('mover');
```
- Define myScroll variable and pull it out of the for loop since it is constant -

  ```var myScroll = document.body.scrollTop / 1250;```
  	

5.) Include updatePositions function as a parameter to the window.requestAnimationFrame 
method in the scroll event listener to optimize the animation.
```
//Optimization: Create a single reflow and repaint cycle

window.addEventListener('scroll', function() {

	window.requestAnimationFrame(updatePositions);

});
```

6.) Create only the necessary number of sliding pizzas instead of 200 to improve performance and still get the desired visual effect. Also,
create movingPizza1 array so do not have to run querySelector inside for loop
```
document.addEventListener('DOMContentLoaded', function() {

  var cols = 8;
  var s = 256;

  // Dynamically calculate the number of pizzas required to fill up the screen
  var height = window.screen.height;
  var rows = height / s;
  var requiredPizzas= Math.ceil(rows*cols);

  //Optimization: create elem variable

  var elem;

  //Optimization: Create movingPizza1 array so do not have to run querySelector inside for loop

  var movingPizzas1 = document.getElementById("movingPizzas1");
  for (var i = 0; i < requiredPizzas i++) {

    elem = document.createElement('img');

    elem.className = 'mover';

    elem.src = "images/pizza.png";

    elem.style.height = "100px";

    elem.style.width = "73.333px";

    elem.basicLeft = (i % cols) * s;

    elem.style.top = (Math.floor(i / cols) * s) + 'px';

    //document.querySelector("#movingPizzas1").appendChild(elem);

    //Optimization: Create array outside of loop to improve performance
	
    movingPizzas1.appendChild(elem);
  
}
```
####Results
---------

Time to resize pizzas before optimization - 199.02ms
Time to resize pizzas after optimization ~ 1.00ms

Inspecting the Timeline in Chrome devtools show dramatically improvements in 
reducing jank. The framerate in most cases in better than 60 FPS.

*Critical CSS Tools*
<a href="https://github.com/addyosmani/critical-path-css-tools" target="_blank"></a>

Resources

| <https://www.igvita.com/2014/05/20/script-injected-async-scripts-considered-harmful>  
| <https://www.npmjs.com/package/grunt-inline>  
| <https://github.com/gruntjs/grunt-contrib-clean>  
| <https://developers.google.com/speed/pagespeed/insights>  
| <https://github.com/andismith/grunt-responsive-images>  
| <http://cameronwp.github.io/udportfolio/views/pizza.html>  
| <https://github.com/junjunruan/P4-Website-Optimization>  
| <https://github.com/allanbreyes/udacity-front-end/tree/master/p4>  
| <https://github.com/mikejoyceio/website-optimization>  