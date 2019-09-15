# Solution

The problem description was confusing at one point because it mentioned Front-end technology like Angular or React but stated that the exercise consisted of **a REST service**, meaning that the only requirement was to implement a Back-end server so the solution only consist of a Node Rest API using MongoDb as the data layer.

## Project structure

**Main folders**

This are the source code files

└ `bin`: Default folder created by express containing the `www` file to start the app

└ `config`: Production and development configuration files

└ `data`: Folder containing `migrations` tu update database structure and the connection utilities in the `db` folder.

└ `domain`: Data access file to abstract domain logic outside express router code. This allows to make changes to the data layer without modifying the router.

└ `helpers`: Error classes, production and development loggers, custom method to send http responses, etc.

└ `resources`: Contains views and static resources. The express default `public` folder as well as the default pug views (not used) are stored here

└ `routes`: Express router logic

└ `test`: Unit testing with mocha

└ `validations`: Request and database schema validation

**Other folders**

This folders might appear depending on the environment (development, production, etc). They are usually ignored in git.

└ `logs`: Production server activity log files

└ `coverage`: Generated coverage information using nyc and mocha.

## Endpoints

The solution required five endpoints:

- To retrieve all stored gateways
- To display details of a single gateway
- To store details of a single gateway
- To add a device to a gateway
- To remove a device fom a gateway

### Get all gateways

```bash
GET /gateways?page=1&size=10&next=123
``` 

The results are always paginated and sorted by serial number. It is usually a bad idea to dump an entire table of your database that could contain millions of records.

The accepted parameters are `page`, `size` and `next`.

The first is your standard page number pagination. The default page if the parameter is not present is `1`.

The second parameter is the amount of records that will be returned on each page. Only `10`, `25` and `50` records are valid values for this parameter and the default is `10`.

The last parameter `next` enables keyset pagination. It cannot be used in conjunction with `page`. You'll have to use one or the other but not both. If the parameter is present it must contain the last received gateway `serial` number. It then querys for the next N records allowing for a faster pagination feature. The motivation for this is that the database command `skip` is known to be slow on higher page numbers. Using keyset pagination with an indexed field is faster and results better resource management and in a uniform user experience.

### Get one gateway

```bash
GET /gateways/5d7d297055a09b18b43fc181
``` 

Gets one object with the information about a gateway

### Add a gateway

```bash
POST /gateways
``` 
Adds a new gateway.

Requires the following parameters in the body:

```bash
{
    name,
    serial,
    ipv4,
}
``` 

You must use a different endpoint to add a device to this gateway.

### Add a device

```bash
POST /gateways/5d7d297055a09b18b43fc181/devices
``` 

Adds a device to a gateway.

Results in an error if the gateway is not found by it's id. Requires the following parameters in the body.

```bash
{
    uid,
    vendor,
    created,
    status,
}
``` 

### Removes a device

```bash
POST /gateways/5d7e117eba4f9659a0aa5290/devices/2345678
``` 

Removes a device from a gateway.

The first parameter is the gatewayId and the second the deviceId. If the gateway or the device is not found it results in the same error. I could check whether the gateway was present first and result in a different error but this would require two separate queries to the database. I choose this approach because it results in less information but it is faster.

## Enforcing database validation

The exercise does not specify if a device can be used by multiple gateways at the same time so it was assumed that every device can only belong to a single gateway.

To meet the validation requirements of having max 10 devices per gateway the database was modeled using One-to-Many Relationships with Embedded Documents. Using an array to store devices only allow to enforce uniqueness between devices of *different gateways* but this can be enforced anyway using a query condition.

## Final considerations

There are Docker configuration files included in the solution but this service is blocked in Cuba so I have no idea if it works. I cannot test it and fix any bugs. I have an account and downloaded an image file but Docker doesn't play well with VPNs and I got an error at the end I could't fix. Sorry about that. Ideally a Docker container should be used to deploy the application in real life.

I also included PM2 to act as a load balancer and maintain a cluster of apps running but using a service like Kubernetes would be better for this tasks. In all cases only one database connection is spawned per app.

The app logger in production uses a daily rotating file strategy that will be at most 50 Mb and last 15 days. You should include a remote logging transport as well for easy access but make sure there is enough space on the server to store the file backup logs in case the remote logging service is down.