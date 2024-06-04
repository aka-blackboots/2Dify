### What is 2Dify?

When was the last time you did the Floorplans yourself?
Never, right? 

Imagine that you can create your own floorplans, how? 

Code - APIs

Tool - Editor

### Why Floorplans?

Well, floorplans are easy but you're right 3D is more realistic.
Since the start of the human evolution we are dealing with classification of things around us.

So, if somebody wants to create a BIM model using floorplans?
Possible with 2Dify, 2Dify uses a TriDify layer which translates the floor information to 3D using Clay

but what about other workflow?
with 2Dify as a start, we can aim to create layers on top of 2Dify to support multiple use cases

### Primitives
- Snapper Tool 
A universally available tool which is available to all `elements`, snapper does not focus on creation.
A Snapper when hovered in plain state will have a small sphere of grey color, which disappears when the mousedown is triggered.
- two events from snapper - onSnapperMove and onSnapperSet - then e.g. the wall can be create at a center and direction and other things being optional params
Snapper should be developed in a such a way that it facilitates in giving the nearest point in two scenarios
  1. Grid Snapper - It should fetch the nearest point on grid. TODO: Make grid better
  2. Mesh Snapper - It should get the nearest point on a mesh

  A third scenario might be needed but I can't think of how it should work or is it necessary. TODO: Future releases

- Floor Helper
Floor helper and Snapper might look similar but has a fine difference.
- It helps you with Normal lines and helper spheres
- Show angles and it's measurement
- More helper functionalities can be added here

### Elements
- Wall Primitive
  1. Creating wall with `center` which states the point. where it starts
  2. The `end` point of where the wall should end
  3. `width` which is used for dimension
  4. Possibily in next releases - Wall Texture, Color, Outline Color - cosmetic changes

### Why I'm doing it?
- It's not who you're underneath but what you do that defines you






