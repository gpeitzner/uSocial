# Arquitectura Implementada
>> La arquitectura implementada consta en 2 maquinas ec2 la cual 1 contendra el servidor y la aplicacion web y la otra contendra la base de datos 

![texto alternativo](/imagenes/arquitectura.png)

>> Se levanto la arquitectura cliente servidor por medio de CloudFormation es cual se describe a continuacion:

>> Se levanto una VPC con dos subredes, una publica y una privada 

>>> ![texto alternativo](/imagenes/vpc.png)

>> Se configuraron las internert gasteway y tablas de ruteo para para una de las subredes

>>> ![texto alternativo](/imagenes/ruteo.png)

>> por ultimo levantamos los servicios por medio de un archivo principal llamado main.yaml

>>> ![texto alternativo](/imagenes/main.png)

> # Red Publica

>> en esta sub red se alojaron una maquina ec2  la cual alojara el servidor y la aplicacion web
>>> ![texto alternativo](/imagenes/publica.png)

> # Grupo de Seguridad para la mquina 
>> La comunicacion de la maquina se establecera por medio del puerto 80 para la aplicacion web, 3000 para el servidor
>> 22 para conexions FTP.
>>> ![texto alternativo](/imagenes/sg.png)

> # Red Privada

>> en esta sub red se alojaron una maquina ec2 la cual alojara unicamente la base de datos.
>>> ![texto alternativo](/imagenes/privada.png)

> # Grupo de Seguridad para la mquina 
>> La comunicacion de la maquina se establecera por medio del puerto -1 para probar la comunicacion por medio de ping, 27017 para comunicacion de la base de datos
>> 22 para conexions FTP.
>>> ![texto alternativo](/imagenes/sgP.png)

> # Usuarios Creados
>> "cognito" : este usuario tendra perminsos de S3 control total y permiso personalizado al pool de usuarios 
>>> ![texto alternativo](/imagenes/cognito.png) 
>>> ![texto alternativo](/imagenes/cogPer.png)

>> "memo" : el cual tendra permisos de administrador y control total
>>> ![texto alternativo](/imagenes/memoIam.png) 

> # Grupo de Usuario

>> ![texto alternativo](/imagenes/grupoU.png) 

> # Bucket de S3

>> ![texto alternativo](/imagenes/buckets.png) 

> # Lamnda

>> ![texto alternativo](/imagenes/lambda.png) 