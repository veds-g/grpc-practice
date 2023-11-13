const grpc = require('@grpc/grpc-js');
const {GreetServiceClient} = require('../proto/greet_grpc_pb');
const {GreetRequest} = require('../proto/greet_pb');

function doGreet(client) {
    console.log("doGreet was invoked");
    const req = new GreetRequest().setFirstName("Devil");

    client.greet(req, (err, res) => {
        if (err) {
            return console.log(err);
        }

        console.log(`Greet: ${res.getResult()}`);
    });
}

function doGreetManyTimes(client) {
    console.log("doGreetManyTimes was invoked");
    const req = new GreetRequest().setFirstName("Vedant");

    const call = client.greetManyTimes(req);

    //event type = data when we receive data from server
    call.on("data", (res) => {
        console.log(`GreetManyTimes: ${res.getResult()}`);
    });
}

function doLongGreet(client) {
    console.log("doLongGreet was invoked");

    const names = ["Vedant", "Devil", "veds"];
    const call = client.longGreet((err, res) => {
        if (err) {
            return console.log(err);
        }
        console.log(`LongGreet: ${res}`);
    })

    names.map((name) => {
        return new GreetRequest().setFirstName(name);
    }).forEach((req) => call.write(req));
    call.end();
}

function doGreetEveryone(client) {
  console.log("doGreetEveryone was invoked");

  const names = ["Vedant", "Devil", "veds"];

  const call = client.greetEveryone();

    call.on("data", (res) => {
        console.log(`GreetEveryone: ${res.getResult()}`);
    });

  names.map(name => {
      return new GreetRequest().setFirstName(name);
  }).forEach(req => call.write(req));
  call.end();
}

function main() {
    const creds = grpc.ChannelCredentials.createInsecure();
    const client = new GreetServiceClient("localhost:50051", creds);

    // doGreet(client);
    // doGreetManyTimes(client);
    // doLongGreet(client);
    doGreetEveryone(client);
    client.close();
}

main();