class Vector2
        {
            constructor(x, y)
            {
                this.x = x;
                this.y = y;

            }

            add(other)
            {
                return new Vector2(this.x + other.x, this.y + other.y);
            }

            subtract(other)
            {
                return new Vector2(this.x - other.x, this.y - other.y);
            }

            multiply(by)
            {
                return new Vector2(this.x * by, this.y * by);
            }

            normalize()
            {
                return this.multiply(1 / (this.magnitude()));
            }

            magnitude()
            {
                return Math.sqrt(this.x * this.x + this.y * this.y);
            }

            toDirection()
            {
                return new Vector2(this.x / this.magnitude(), this.y / this.magnitude());
            }

            rotate(angle)
            {
                var currentAngle = Math.atan2(this.y, this.x);
                currentAngle += angle;
                return Vector2.fromAngle(currentAngle).multiply(this.magnitude());
            }

        }

        Vector2.direction = function(a, b)
        {
            return b.subtract(a).toDirection();
        }

        Vector2.fromAngle = function(angle)
        {
            return new Vector2(Math.cos(angle), Math.sin(angle)).normalize();
        }

        Vector2.distance = function(a, b)
        {
            return b.subtract(a).magnitude();
        }

        Vector2.crossProduct = function(a, b)
        {
            return a.x * b.y - a.y * b.x;
        }

        Vector2.dotProduct = function(a, b)
        {
            return a.x * b.x + a.y * b.y;
        }

        Vector2.project = function(a, b)
        {
            return new Vector2(a.x * b.x, a.y * b.y);
        }

        class Size
        {
            constructor(width, height)
            {
                this.width = width;
                this.height = height;
            }
        }

        class Rigidbody
        {
            constructor(position, rotation, size)
            {
                this.position = position;
                this.rotation = rotation;
                this.size = size;
                this.mass = 1;

                this.velocity = new Vector2(0, 0);
                this.acceleration = new Vector2(0, 0);

                this.angularVelocity = 0;
                this.angularAcceleration = 0;
            }
        }

        class Force
        {
            constructor(name, color, origin, applicationPoint, showOrigin = false)
            {
                this.name = name;
                this.origin = origin;
                this.applicationPoint = applicationPoint;
                this.color = color;
                this.showOrigin = showOrigin;
                this.magnitude = 1;
            }

            getVector()
            {
                var v = Vector2.direction(this.origin, this.applicationPoint).multiply(this.magnitude);
                return v;
            }

            setVector(v)
            {
                this.applicationPoint = this.origin.add(v.normalize().multiply(this.magnitude));

            }
        }
    

    
    function drawText(ctx, text, absolutePosition)
    {
        var position = absolutePosition.subtract(cameraPosition);

        ctx.fillStyle = "black";
        ctx.font = "15px Arial";
        ctx.textAlign = "center";   
        ctx.fillText(text,position.x, position.y);
    }
    function drawImageCentered(image, absolutePosition, rotation, size)
    {
        var position = absolutePosition.subtract(cameraPosition);

        ctx.translate(position.x, position.y);
        ctx.rotate(rotation);

        ctx.drawImage(image, - size.width / 2, - size.height / 2, size.width, size.height);

        ctx.rotate(-rotation);

        ctx.translate(-position.x, -position.y);
    }

    function getLeftWheelPosition()
    {

        return car.position.add(new Vector2(-82, 30).rotate(car.rotation));
       // return new Vector2(car.position.x - 82, car.position.y + 30);
    }

    function getRightWheelPosition()
    {
        return car.position.add(new Vector2(95, 30).rotate(car.rotation));
        //return new Vector2(car.position.x + 95, car.position.y + 30);

    }
    function drawCar()
    {
         drawImageCentered(carImage, car.position, car.rotation, car.size);

        drawImageCentered(wheelImage, leftWheel.position, leftWheel.rotation, leftWheel.size);
        drawImageCentered(wheelImage, rightWheel.position, rightWheel.rotation, rightWheel.size);
    }



    function canvas_arrow(context, fromx, fromy, tox, toy)
    {
        var headlen = 10;   // length of head in pixels
        fromx -= cameraPosition.x;
        fromy -= cameraPosition.y;

        tox -= cameraPosition.x;
        toy -= cameraPosition.y;

        var angle = Math.atan2(toy-fromy,tox-fromx);
        context.moveTo(fromx, fromy);
        context.lineTo(tox, toy);
        context.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
        context.moveTo(tox, toy);
        context.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
    }

    function drawVector(ctx, origin, applicationPoint, color, showOrigin)
    {
        var magnitude = 100;

        //var origin = new Vector2(applicationPoint.x + magnitude * Math.cos(angle+Math.PI), applicationPoint.y + magnitude * Math.sin(angle+Math.PI));

        ctx.beginPath();

        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        canvas_arrow(ctx, origin.x, origin.y, applicationPoint.x, applicationPoint.y);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();

        if (showOrigin)
        {
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            ctx.arc(origin.x-cameraPosition.x, origin.y-cameraPosition.y, 5, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.closePath();
            }
    }

    function drawPolygon(points)
    {
        ctx.beginPath();
        for (var i = 0; i < points.length - 1; i++)
        {
            ctx.moveTo(points[i].x-cameraPosition.x, points[i].y-cameraPosition.y);
            ctx.lineTo(points[i+1].x-cameraPosition.x, points[i+1].y-cameraPosition.y);
        }
        ctx.stroke();
        ctx.closePath();
    }


    function drawGraph(name, origin, size, history, isYreversed = false)
    {
        maximum = new Vector2(history[0].x, history[0].y);

        for (var i = 0; i < history.length; i++)
        {
            if (history[i].x > maximum.x)
                maximum.x = history[i].x;
            if (history[i].y > maximum.y)
                maximum.y = history[i].y;
        }


        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.strokeStyle = "black";

        canvas_arrow(ctx, origin.x, origin.y, origin.x, origin.y-size.height);

        ctx.stroke();
        ctx.closePath();


        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.strokeStyle = "black";
  
        canvas_arrow(ctx, origin.x, origin.y, origin.x+size.width, origin.y);

        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        for (var i = 0; i < history.length-1; i++)
        {
            if (isYreversed)
            {
                var A = new Vector2(origin.x + history[i].x / maximum.x * size.width, origin.y-size.height+history[i].y/maximum.y * size.height);
                var B = new Vector2(origin.x +history[i+1].x / maximum.x * size.width, origin.y-size.height+history[i+1].y/maximum.y * size.height);
            }
            else
            {
                    var A = new Vector2(origin.x + history[i].x / maximum.x * size.width, origin.y - history[i].y / maximum.y * size.height);
                var B= new Vector2(origin.x + history[i+1].x / maximum.x * size.width, origin.y - history[i+1].y / maximum.y * size.height);
            }
        
            ctx.moveTo(A.x, A.y);
            ctx.lineTo(B.x, B.y);
        }
        ctx.stroke();
        ctx.closePath();

        drawText(ctx, name, new Vector2(origin.x + size.width / 2, origin.y + 50));


    }
    function drawGraphs()
    {

        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = "black";

        cameraPosition = new Vector2(0, 0);

        drawGraph("y = y(t)", new Vector2(200, 500), new Size(400, 400), yHistory, true);
        drawGraph("theta = theta(t)", new Vector2(800, 500), new Size(400, 400), thetaHistory);


        


       
    }
    function draw()
    {
        var cameraOKx = true;
        var cameraOKy = true;

       /* if (car.position.x + car.size.width * 1.5 >= width - cameraPosition.x)
        {
            cameraPosition.x += car.position.x + car.size.width * 1.5 - width - cameraPosition.x;
            cameraOK = false;
        }*/

        /*if (car.position.y + car.size.height * 1.5 >= height - cameraPosition.y)
        {
            cameraPosition.y += car.position.y + car.size.height * 1.5 - height - cameraPosition.y;
            cameraOK = false;
        }*/

      //  if (car.position.x - car.size.width * 1.5 <= cameraPosition.x)
        //    cameraPosition.x += car.position.x - car.size.width * 1.5 - cameraPosition.x;

        /*if (car.position.y - car.size.height * 3 <= cameraPosition.y)
        {
            cameraPosition.y += car.position.y - car.size.height * 3 - cameraPosition.y;
            cameraOK = false;    
        }*/

        if (car.position.x >= width/2)
            cameraOKx = false;
        if (car.position.y <= height/2)
            cameraOKy = false;

        if (!cameraOKx || !cameraOKy)
        {
            var aux = new Vector2(0, 0);

            if (!cameraOKx)
                aux.x += car.position.x-width/2;
            if (!cameraOKy)
                aux.y += car.position.y-height/2;
            cameraPosition = aux;
        }


        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = "black";


        // ground
        ctx.beginPath();
        ctx.moveTo(0, groundHeight-cameraPosition.y);
        ctx.lineTo(width, groundHeight-cameraPosition.y);

        ctx.stroke();
        ctx.closePath();

        // inclined plane
    drawPolygon(inclinedPlane);

        /*ctx.moveTo(600, groundHeight);
        ctx.lineTo(800, groundHeight-200);
        ctx.moveTo(800, groundHeight-200);
        ctx.lineTo(800, groundHeight);
        ctx.moveTo(800, groundHeight);
        ctx.lineTo(600, groundHeight);*/
        //ctx.stroke();
        //ctx.closePath();



        // car
          drawCar();

          // water
          if (isWater)
          {
                ctx.beginPath();
                ctx.fillStyle = 'rgba(153, 214, 255, 0.5)';
                ctx.fillRect(planeLength - cameraPosition.x, groundHeight - waterHeight - cameraPosition.y, 5000 , waterHeight);

                ctx.closePath();
        }

        // forces
        if (showForces)
        {
            for (i = 0; i < forces.length; i++)
            {
                var direction = Vector2.direction(forces[i].origin, forces[i].applicationPoint);

                drawVector(ctx, forces[i].origin, forces[i].applicationPoint, forces[i].color, forces[i].showOrigin);
                drawText(ctx, forces[i].name, forces[i].applicationPoint.add(direction.rotate(Math.PI/2).multiply(20)), forces[i].color);
            }
        }


    }


       function loop(dt)
            { 
                forces = [];


                // both wheels on the plane
                var centerOfMass = car.position.add(Vector2.fromAngle(car.rotation).multiply(-(1-massSlider)*car.size.width/2)).add(Vector2.fromAngle(car.rotation).multiply(massSlider*car.size.width/2));

                var gravity = new Force("G", "black", centerOfMass, centerOfMass.add(new Vector2(0, 100)), true);
                gravity.magnitude = 9.81 / 5;

                var normalLeft = new Force("N1", "blue", leftWheel.position.add(new Vector2(0, leftWheel.size.height).rotate(car.rotation)), leftWheel.position.add(new Vector2(0, leftWheel.size.height * 0.5).rotate(car.rotation)) );

                var normalRight = new Force("N2", "blue", rightWheel.position.add(new Vector2(0, rightWheel.size.height).rotate(car.rotation)), rightWheel.position.add(new Vector2(0, rightWheel.size.height * 0.5).rotate(car.rotation)) );


                //var leftPercent = Vector2.distance(leftWheel.position, car.position) / Vector2.distance(leftWheel.position, rightWheel.position);
                normalRight.magnitude = Vector2.project(gravity.getVector(), Vector2.fromAngle(car.rotation+Math.PI/2)).magnitude() * 0.5;
                normalLeft.magnitude = Vector2.project(gravity.getVector(), Vector2.fromAngle(car.rotation+Math.PI/2)).magnitude() * 0.5;
                //normalRight.setVector(new Vector2(0, -95 / (82+95) * gravity.getVector().project()));

                //normalLeft.setVector(new Vector2(0, -82 / (82+95) * gravity.getVector().y));



                 var drag = new Force("Fd", "red", car.position.add(car.velocity.normalize().multiply(car.size.width)), car.position.add(car.velocity.normalize().multiply(car.size.width/2)))

                var currentRho = rho;
               // if (car.position.x > planeLength && (leftWheel.position.y >= groundHeight - waterHeight || rightWheel.position.y >= groundHeight-waterHeight))
               if (isWater && car.position.x > planeLength && car.position.y >= groundHeight - waterHeight)
                    currentRho = 100;

                drag.magnitude = 0.5 *  frictionCoef * 2.2 *  currentRho *car.velocity.magnitude() * car.velocity.magnitude();

                var traction = new Force("Ft", "green", rightWheel.position.add(new Vector2(0, rightWheel.size.height/2)), rightWheel.position.add(new Vector2(0, rightWheel.size.height/2)).add(Vector2.fromAngle(car.rotation).multiply(rightWheel.size.width)));

                traction.magnitude = 4;

                forces.push(gravity);
                

                /*var rightWheelOnPlane = (rightWheel.position.x < 1200 && rightWheel.position.add(Vector2.fromAngle(car.rotation+Math.PI/2).multiply(1)).y >= (groundHeight-rightWheel.position.x*Math.tan(inclinedPlaneRotation)));
                var leftWheelOnPlane = (leftWheel.position.x < 1200 && leftWheel.position.add(Vector2.fromAngle(car.rotation+Math.PI/2).multiply(1)).y >= (groundHeight-leftWheel.position.x*Math.tan(inclinedPlaneRotation)));*/


                var rightDifference = rightWheel.position.y + rightWheel.size.height / 2 - (groundHeight-rightWheel.position.x * Math.tan(inclinedPlaneRotation));
                var leftDifference = leftWheel.position.y + leftWheel.size.height / 2 - (groundHeight-leftWheel.position.x*Math.tan(inclinedPlaneRotation));

                rightWheelOnPlane = rightWheel.position.x < planeLength;// && rightDifference >= 0)
                leftWheelOnPlane = leftWheel.position.x < planeLength;// && leftDifference >= 0);

                //if (rightWheelOnPlane && leftWheelOnPlane)
                  //  gravity.magnitude = normalLeft.magnitude = normalRight.magnitude = 0;
                if (rightWheelOnPlane)
                {
                    forces.push(normalRight);
                
                    if (pressedAcceleration)
                    {
                        forces.push(traction);
                    }


                }
                
                if (leftWheelOnPlane)
                {
                    forces.push(normalLeft);
                }


                if (car.velocity.magnitude() != 0)
                {
                    forces.push(drag);
                }
                    
                // calculate final force                
                var finalForce = new Vector2(0, 0);
                var torque = 0;

                for (var indx = 0; indx < forces.length; indx++){
                    finalForce =   finalForce.add(forces[indx].getVector());

                    if ( (!rightWheelOnPlane || forces[indx].name != "G") && (!rightWheelOnPlane || forces[indx].name != "N1") && forces[indx].name != "N2"   && forces[indx].name != "Ft")
                        torque += Vector2.crossProduct(forces[indx].applicationPoint.subtract(car.position), forces[indx].getVector());
                }
                
                torque += 0.5 * currentRho * frictionCoef * (-car.angularVelocity) * car.angularVelocity;
                //console.log(torque);

                car.angularAcceleration = torque / 5;
                car.angularVelocity += car.angularAcceleration * dt;

                var dtheta = car.angularVelocity * dt;
                car.rotation += dtheta * (Math.PI / 180);
                //car.rotation += dtheta;
                
                //console.log(dtheta);
                //console.log(finalForce);

                // Velocity verlet integration
                var last_acceleration = car.acceleration;
                var dr = car.velocity.multiply(dt).add(last_acceleration.multiply(0.5 * dt * dt));

             
                var new_acceleration = finalForce;
                //if (pressedAcceleration && rightWheelOnPlane)
                  //  new_acceleration = Vector2.fromAngle(car.rotation);

                    
                var avg_acceleration = last_acceleration.add(new_acceleration).multiply(1/2);

                car.velocity = car.velocity.add(avg_acceleration.multiply(dt));
                
                car.position = car.position.add(dr.multiply(100)); 
                //car.rotation = -inclinedPlaneRotation;
                //leftWheel.position = leftWheel.position.add(dr.multiply(100));
                //rightWheel.position = rightWheel.position.add(dr.multiply(100));
                leftWheel.position = getLeftWheelPosition();
               rightWheel.position = getRightWheelPosition();
                //
               // car.position = leftWheel.position.multiply(95/(82+95)).add(rightWheel.position.multiply(82/(82+95))).add(new Vector2(0, -30));//leftWheel.position.add(rightWheel.position).multiply(1/2).add(new Vector2(0, -30));

                //car.rotation = Math.atan2(rightWheel.position.y-leftWheel.position.y, rightWheel.position.x - leftWheel.position.x);

                if (leftWheelOnPlane)
                    leftWheel.rotation += dr.magnitude();
                
                if (rightWheelOnPlane)
                    rightWheel.rotation += dr.magnitude();
   

                draw();



        }


    function stepSimulation(timestamp) {
      if (!start) start = timestamp;
      var progress = timestamp - start;
      //console.log(progress / 1000);
        loop(progress / 1000);    
        start = timestamp;

        if (!rightWheelOnPlane)
        {
            if (!startedRecording)
            {
                recordingStartTime = timestamp;
                startedRecording = true;
            }
            yHistory.push(new Vector2((timestamp-recordingStartTime)/1000, car.position.y));
            thetaHistory.push(new Vector2((timestamp-recordingStartTime)/1000, car.rotation));
        }
        if (car.position.x > planeLength && (leftWheel.position.y + leftWheel.size.height/2 >= groundHeight || rightWheel.position.y + rightWheel.size.height/2 >= groundHeight))
        {
            $("#canvas").fadeOut(2000, function() {
                drawGraphs();
                $("#canvas").fadeIn(1500);
            });
        }
        else
            window.requestAnimationFrame(stepSimulation);

      }
    
    function play()
    {
        // $("#menu").hide(2000);
            startedRecording = false;
            rightWheelOnPlane = true;
            yHistory = [];
            thetaHistory = [];

            carImage = $("#car").get(0);
            wheelImage = $("#wheel").get(0);


            rho = $("#rho").val();
            frictionCoef =$("#frictionCoef").val();

            massSlider = $("#massSlider").val();
            isWater = $("#isWater").get(0).checked;


        width = ctx.canvas.width = window.innerWidth;
           groundHeight = height - 150;
            car = new Rigidbody(new Vector2(0, groundHeight - 78 / 2 - 20), 0, new Size(300, 78));
            car.mass = $("#carMass").val();





            leftWheel = new Rigidbody(new Vector2(-82, groundHeight - 55 / 2), 0, new Size(55, 55));
            rightWheel = new Rigidbody(new Vector2(95, groundHeight - 55 / 2), 0, new Size(55, 55));
            
            leftWheel.position = getLeftWheelPosition();
            rightWheel.position = getRightWheelPosition();


            cameraPosition = new Vector2(0, 0);
            start = false;

            passedPlane = false;
            
            planeLength = 1000;
            inclinedPlane = [];
            inclinedPlaneRotation = $("#inclinedPlaneRotation").val() * (Math.PI/180);
            inclinedPlane.push(new Vector2(0, groundHeight));
            inclinedPlane.push(new Vector2(planeLength, groundHeight-planeLength*Math.tan(inclinedPlaneRotation)));
            inclinedPlane.push(new Vector2(planeLength, groundHeight));
            inclinedPlane.push(new Vector2(0, groundHeight));

            waterHeight = planeLength * Math.tan(inclinedPlaneRotation) * 0.5;

                
            car.rotation = -inclinedPlaneRotation;
                window.requestAnimationFrame(stepSimulation);
       //     clearInterval(animationInterval);
     //       animationInterval = setInterval(loop, dt * 1000);
    }



        $(document).ready(function()
        {
            height = 800;
            width =  1000;
            //dt = 0.02;


            var canvas = $("#canvas").get(0);
            ctx = canvas.getContext('2d');
            
            animationInterval = 0;

            showForces = $("#showForces").get(0).checked;
            $("#showForces").change(function() 
            {
                showForces = this.checked;
            })

            pressedAcceleration = $("#autoAcc").get(0).checked;
            $(document).keydown(function(event){
                var x = String.fromCharCode(event.which); 
                if (x == 'a' || x == 'A')
                {
                    pressedAcceleration = true;
                }
            });

            $(document).keyup(function(event) {
                 pressedAcceleration = $("#autoAcc").get(0).checked;
            });

            windowWidth = $(window).width();
            windowHeight = $(window).height();

            $(window).resize(function(){
                windowWidth = $(window).width();
                 windowHeight = $(window).height();
        // windowWidth & windowHeight are automatically updated when the browser size is modified
            });

        /* A real project should use requestAnimationFrame, and you should time the frame rate and pass a variable "dt" to your physics function. This is just a simple brute force method of getting it done. */
    //setInterval(loop, dt * 1000);

    })
       
    
