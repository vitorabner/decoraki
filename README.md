![Decoraki Logo](http://www.decoraki.co/img/decoraki-full-logo.png)
> 3D Simulator for interior design - http://www.decoraki.co

## Decoraki

[![Build Status](https://img.shields.io/travis/vitorabner/decoraki/master.svg?style=flat)](https://travis-ci.org/vitorabner/decoraki)

Decoraki is a 3D simulator that aims to help people to decorate and furnish their homes, providing them a way to inspire, combine products and bring their ideias to life.

## Install

First install all dependecies

```sh
npm install
```

And then run the project

```sh
npm run dev
```

## File format

Decoraki only supports 3D collada(.dae) format. If you have another 3D file format, don't worry, it's very easy to convert. You can use softwares like SketchUp, Blender and Collada Exporter for Unity3D.

## How it works

First we need to create a model(you can see all examples in src/helpers/decoraki.repository.js):

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

## Browser Support

Unfortunately WebGL isn't fully supported by all browser, but as you can see [here](http://caniuse.com/#search=webgl) **Chrome(45+)** is the best browser to run this project.

## Contributing

If you want to colaborate check the project's issues.

1. Fork the repository
2. Create a new branch
3. Implement your solution
4. Commit
5. Open a Pull Request

Remeber: Always run lint and test. If you change the core system update the tests.

Thanks!

## License

[MIT License](https://github.com/vitorabner/decoraki/blob/master/LICENSE.md) © Vitor Abner


