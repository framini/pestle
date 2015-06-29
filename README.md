# Pestle [![Build Status](http://img.shields.io/travis/framini/pestle/master.svg?style=flat)](https://travis-ci.org/framini/pestle) [![Dependency Status](http://img.shields.io/david/framini/pestle.svg?style=flat)](https://david-dm.org/framini/pestle) [![devDependency Status](http://img.shields.io/david/dev/framini/pestle.svg?style=flat)](https://david-dm.org/framini/pestle#info=devDependencies)

An architecture framework for component based websites. It is MV* framework agnostic and its main goal is to provide a standard way for:
* defining components
* sharing functionality across components
* bootstrapping components with backend/default data



## Architecture Definition
#### Base
The purpose of this layer is to declare and abstract the access to the base set of libraries that the rest of the stack will depend on. Its the place we could define how to interact with the DOM, Ajax functionality, utils, and so on.

#### Core
The core layer will depend on the base library and will provide the core set of functionality to application framework. Main responsibilities:

Designed to be extensible. This means that the core should only include a small subset functionalities and every other functionality that could came up later should be added as an extension to it. So for example, if we need to provide the functionality to interact with certain API we could just develop an extension that the app will load from a separate module without having to touch the core code. This could be accomplished through an Extension Manager that will be part of the core layer.
Life cycle management for components. Provides functionality for both, start and stop a component and when to do it.
Logging. With different logging levels that could be easily configured based on the environment
Provides a way for components to communicate with each other (Event Bus)

#### Extension
Extensions allows you to add new functionality to the application which is gonna be available to the components through their sandbox object.

#### Sandbox (Facade)
* consistency
* security

An interface to Core with which the module can interact to ensure loose coupling with the rest of the application. It is the only thing a component should know about and each module has its own copy.

This is gonna be a thin layer and will be the only thing that a component will know about the rest of the world and defines how it should interact with it. So this way we could “limit” the things a component should and shouldn't do, and because it is the only thing that a component should know about, it makes much easier to promote standardized ways  of doing general things like HTTP requests, DOM manipulation, and so on, across a large team or organization.

When the app starts, it will create an instance of sandbox in each of our components.

The other thing that the sandbox can do, is to create a common way for accessing libraries and utilities through a canonical interface (a facade), rather than calling library code directly. Doing so allows you to modify the implementation, or swap out the library completely with transparency to the application code.

#### Component
A component represents a single unit of a page. Each component should be independent and know nothing about each other. Here are some of the rules that each component should follow:

A component should be able to live on its own and it could be 0 to N instances of each component on the same page. 
Through the mediator pattern (provided by the core and served to the component through the Facade) we could have loosely coupled components that could interact with each other if needed.
Each component will have an instance of the facade and will be the only thing a component will know about the external world. The external world would be everything that resides outside the scope of the component. So a component should not:
Should not create nor modify global variables (window, document, etc)
Should not Modify/create DOM elements outside the component scope
Should not Call methods directly from other objects, globals, or anything that can’t be accessible through the Facade or method defined within the component. Overall, a component should only call methods that lives in the facade or defined within the component.
Should not Reference other components directly


## Getting Started

#### Defining a component:

In your HTML you’ll need something like the following:
```html
<div data-platform-component=”ExampleModule”></div>
```

In your javascript something like this:
```javascript
var Pestle = require(‘pestle’);

Pestle.Module.add(ExampleModule, {
    initialize: function() {
        // cool stuff
   }
});
```

This is the minimal markup and JS needed for defining a component. Until this point, Pestle only knows about the component’s definition but it will do nothing until we call the Pestle’s start method (covered next).
Within the initialize method you’ll have access to the options and sandbox object that will be explained in the following sections
Passing options to a component (the option object)

The options object is created based on all of the data-<namespace>-* attributes defined in DOM element used to declare the component. Using our previous example, we could pass a couple of options to our component using the following notation: 

```html
<div data-platform-component=”ExampleModule” data-platform-bar=”baz” data-platform-baz=”bar”></div>
```

All the data-<namespace>-name (where name is a string != “component”) will be added as a key:value pair within the options object. In this case in particular, the options object will have:
* this.options.bar and 
* this.options.foo 

Since both were defined in the HTML definition of the component. This is how you should bootstrap the component with data coming from the backend or with default values . 

On top of the defined variables, there is extra property that is gonna be added to the options object that is gonna hold a reference to the DOM element used to define the component (Since the component should not modify anything outside its DOM scope), that can be accessed through the options object as: 
* this.options.el

Interacting with outside world (the sandbox object)
As explained in the Sandbox definition, this object will represent the only thing a component should know about the outside world, and it will provide access to all the functionality provided by Pestle (most of the functionality provided by Pestle will be added in the form of an Extension, which will be covered in the Extension section).l
Extending a component (experimental)
There is an easy way of adding new functionality to existing Pestle modules. Here is the syntax: 

```javascript
// You could also extend a module's definition as follows:
Pestle.Module.extend(ExampleModule, {
    initialize: () ->
        // can call the initialize method from the parent if needed as
        //@_super_()

        // new cool stuff
}, 'ModuleToExtend' )
```

## Adding events
Pestle provides an easy way of adding event listeners within the module definition, in a similar way Backbone’s Views.

```javascript
Pestle.Module.add(ExampleModule, {
    events: {
       'click .button: 'customHandler'
    },
    initialize: function() {
        // cool stuff
   },
   customHandler: function() {
      // more cool stuff
   }
});
```javascript

#### Citing Backbone’s documentation:
Uses jQuery's on function to provide declarative callbacks for DOM events within a view. If an events hash is not passed directly, uses this.events as the source. Events are written in the format {"event selector": "callback"}. The callback may be either the name of a method on the view, or a direct function body. Omitting the selectorcauses the event to be bound to the view's root element (this.el). By default,delegateEvents is called within the View's constructor for you, so if you have a simpleevents hash, all of your DOM events will always already be connected, and you will never have to call this function yourself.
The events property may also be defined as a function that returns an events hash, to make it easier to programmatically define your events, as well as inherit them from parent views.

## Extensions
Pestle is built with the idea in mind to be extended. This means that each project using Pestle is encouraged to add their needed functionality through extensions.
What is an extension and why would I need it?

Remember the sandbox object that is accessible within our component’s definition? An extension will basically extend that object with new functionality. The sandbox object will contain and expose every single functionality that we are planning to provide (ajax functionality, DOM manipulation and so on) through methods, like:

```javascript
this.sandbox.dfp.getOptions()
```

where “dfp” is the name of extension (each extension should define its own namespace)

## How to create an extension?
Extensions could be defined with a similar syntax to the one used for defining components, but with a couple of additions. The following is the minimal required syntax to define an extension:

```javascript
var example = {

    initialize: function(app) {

        /**
         * create the namespace to expose the new functionality
         */
        app.sandbox.example = app.sandbox.example || {};

        /**
         * adds a method bar() to the example namespace
         * within the component, its gonna be accessible like:
         * this.sandbox.example.bar()
         */
        app.sandbox.example.bar = function(){
            /**
             * cool stuff
             */
        }
    },
    name: 'Example Extension',

    /**
     * The exposed key name that could be used to pass options
     * to the extension
     * Note: By convention we'll use the filename
     */
    optionKey: 'example'
}

module.exports = example;
```
