# `@gvhinks/epl-host-model`

## Model Server

This is a simple hosting program that will serve up the files

- model.json
- weights.bin

so that they can be consumed in the client.

### Technical Description
The model folder contains the two files required for tensor flow's **loadLayersModel**.

When a client side issues a request for a model file such as 

```javascript
const model = await tf.loadLayersModel('http://localhost:3000/model.json');
```

Then the model.json file is served.

**note**
the loadLayersModel function in tensor flow will, after loading the json file, load the
binary file **weights.bin**.

Essentially even though you tell it to get the json file it implicitly gets both.

But it will not fail if the weights file is not present!

