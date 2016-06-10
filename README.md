![Decoraki Logo](http://www.decoraki.co/img/decoraki-full-logo.png)
> 3D Interior design application build with ThreeJS - http://www.decoraki.co

## Decoraki

Decoraki is a 3D simulator that aims to help people to decorate and furnish their homes, providing them a way to inspire, combine products and bring their ideias to life.

## Install

First install all dependecies

```sh
npm install
```

```sh
bower install
```

And then run the project

```sh
npm run gulp
```

```sh
npm run gulp watch
```

## Collada Format

Decoraki only supports 3D collada(.dae) format. If you have another file format don't worry, it's very easy to convert. You can use softwares like SketchUp, Blender and Collada Exporter for Unity3D.

## How it works

First we need to declare an model(you can see all examples in src/helpers/decoraki.repository.js):

```sh
    var sofa = {
        model: 'Sofa01.dae',
        lightMap: 'Sofa01_LM.jpg',
        folderName: 'Sofa01',
        descriptionName: 'Kael The Invoker',
        descriptionImage: 'invoker.jpg',
        moveType: 'floor',
        category: 'furniture'
    };
```

Two properties are important: category and moveType. 

The **category** property can be a room, furniture or texture, it defines the model's behavior. For example: If the model's category is a furniture you can drag, rotate and delete.

The **moveType** property defines if an object can be dragged in wall, floor or both.

To insert the sofa in simulator:

```sh
    simulator.insertObject(sofa);
```





