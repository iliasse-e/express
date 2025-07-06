# Les méthodes disponibles sur l'objet response

Il possède 3 propriétés et 21 méthodes.

## `send()`

```javascript
res.send(new Buffer('un buffer')); // renvoie un fichier
res.send({ un: 'objet' }); // renvoie un JSON
res.send('<p>une string</p>'); // renvoie du html
res.send([ 'un array']); // renvoie un JSON
```

En résumé, cette méthode va faire pas mal de travail pour nous !

(Cette méthode est un long code source Express)

Elle va commencer par définir le header ``Content-Type`` si nous ne l'avons pas défini en fonction du type du body passé en paramètre.

Ensuite, elle va définir l'encoding par défaut à ``utf-8`` si il s'agit d'une string. 

Elle va également définir l'``ETag`` pour le cache (nous y reviendrons).

Elle va enfin définir le header ``Content-Length`` de manière automatique.

Après avoir défini tous les headers nécessaires, elle va également vérifier que le statusCode n'est pas ``304`` pour Not Modified ou ``204`` pour No Content

Si c'est le cas, elle va supprimer tous les headers et envoyer un ``body`` vide.

Enfin elle utilise la méthode res.end pour envoyer le ``body`` en passant l'encoding également. 

## `end()`

l s'agit de la méthode Node.js que nous avons déjà vue. 

Lorsque vous utilisez Express préférez toujours l'utilisation de send() ou json() car elles vont définir tous les headers pour vous. 

Le seul cas d'utilisation de cette méthode avec Express est lorsque vous souhaitez envoyer la réponse sans aucun body : 

```javascript
res.end()
```

## `status()`

```javascript
res.status(403).end();
res.status(400).send('Bad Request');
```

## `sendStatus()`

```javascript
res.sendStatus(200); // équivalent à res.status(200).send('OK')
res.sendStatus(500); // équivalent à res.status(500).send('Internal Server Error')
res.sendStatus(404); // équivalent à res.status(404).send('Not Found')
```
## `json()`

Cette méthode va utiliser JSON.stringify sur le body passé en paramètre.

Elle va également définir le header Content-Type à application/json si nous n'en avons pas défini. 

Après ces deux étapes, elle va utiliser la méthode send. 

## `sendFile()`

Cette méthode est beaucoup plus complexe et repose sur la librairie send développée par l'équipe d'Express. Elle fait 1200 lignes et permet essentiellement de créer un stream de lecture du fichier pour pouvoir le pipe sur la réponse, qui rappelons le est un writable stream.


# Les méthodes sur res pour définir les headers

## La méthode `set()`

Cette méthode permet de définir les header de la réponse et utilise tout simplement la méthode native ``setHeader`` de Node.js. 

Mais contrairement à celle-ci elle peut prendre en argument un objet de plusieurs headers et elle va utiliser la méthode ``setHeader`` pour chaque propriété. 

## La méthode `append()`

Cette méthode est extrêmement simple : elle ajoute un header au lieu de définir les headers comme ``set()``. 

Il faut donc obligatoirement utiliser cette méthode après ``res.set()`` sinon vous allez écraser les headers définis avec ``append()``.

# 2 - Utilisation de Talend API Tester et les middleware json et urlencoded

body-parser est un middleware permettant de parser le body d'une requête, par exemple POST, pour ne pas à avoir à faire soi même

## Le parser ``json()``

Sur l'objet express vous avez à disposition un middleware permettant d'utiliser le parser json de body-parser.

Le middleware va parser le body de la requête et le mettre sur l'objet req et plus précisément sur req.body le rendant extrêmement facile d'accès pour vos opérations.

En l'utilisant avec app.use() nous parsons tous les body de toutes les requêtes.

Par défaut, le parser s'exécutera dès lors que le header Content-Type a pour valeur application/json. 

## Le parser ``urlencoded()``

e même, vous avez également accès à un autre parser sur l'objet express permettant d'utiliser le parser urlencoded de body-parser.

Ce parser est utilisé pour le format x-www-form-urlencoded.

Dans ce format, le body est de la forme var1=val1&var2=val2

```javascript
const express = require('express');
const app = express();

const jsonParser = express.json();
const urlencodedParser = express.urlencoded({ extended: false });

app.post('/login', jsonParser, (req, res) => {
  res.send('Coucou ' + req.body.prenom);
})

app.post('/api/users', urlencodedParser, (req, res) => {
  res.send('Coucou ' + req.body.prenom);
})
```

# 3 - Le middleware Morgan

Morgan est un logger pour les requêtes Http qui est maintenu par l'équipe d'Express. 

# 4 - Routing

## Pattern de chaîne de caractères

```javascript
app.get('/ab?cd', (req, res) { }) // match /acd et /abcd

app.get('/ab(cd)?e', (req, res) { }) // match /abe et /abcde

app.get('/ab*c', (req, res) { }) // match /abc ou /abIJOFE213c ou /ab1c, etc.

app.get('/ab+c', (req, res) { }) // match /abc ou /abbc ou /abbbbbbc, etc.

app.get(/a/, (req, res) { }) // Regex
```

## Paramètres

## Récupération des paramètres

Les paramètres des routes sont des segments de path qui sont nommés et utilisés pour capturer des valeurs à une position spécifique de l'URL.

Les valeurs capturées sont ensuite mises sur l'objet ``req.params``.


Pour la requête HTTP suivante :

http://localhost:3000/users/34/books/8989

On écrit le code :

```javascript
app.get('/users/:userId/books/:bookId', (req, res) => {
  console.log(req.params); // { "userId": "34", "bookId": "8989" } 
});

```

##  Utilisation du tiret et du point pour décomposer un segment d'URL

Grâce au tiret - et au point ., on peut décomposer un seul segment d'une URL en plusieurs paramètres et donc les stocker dans différentes variables. 

Pour la requête GET suivante :

http://localhost:3000/flights/LAX-SFO

```javascript
app.get('/flight/:from-:to', (req, res) => {
    res.send('Hello ! ' + 'You are going from ' + req.params.from + ' to ' + req.params.to);
})
```

## Contrôler le type des caractères des paramètres

Pour contrôler les caractères qui pourront être match comme paramètre, vous pouvez utiliser des regex. 

## Utilisation de app.param

Il est possible de définir une fonction de callback qui sera déclenchée à chaque fois qu'un paramètre match.

Cette fonction va recevoir les arguments suivants :

``(req, res, next, value, name)``

value est la valeur du paramètre et name son nom.

### Cas d'utilisation classique : la récupération d'un utilisateur

Un cas classique peut être la récupération d'un user dans la base de données.

Vous avez une requêtes sur le path ``/user/:userid`` et vous voulez que le user soit disponible dans toutes les routes qui match. 

C'est un cas parfait pour utiliser ``app.param`` : 

```javascript
app.param('userid', (req, res, next, userId) => {...})
// Sera invoqué à chaque fois que userid est renseigné dans un path
```

## `app.route()` & `app.all()`


La méthode app.all permet de matcher toutes les méthodes Http.

Un cas classique d'utilisation est pour les api requérant une authentification

```javascript
app.all('/api/*', requireAuthentication);
```

Il existe un raccourci permettant de définir plusieurs méthodes pour le même path.

Très souvent vous voudrez pour une ressource donnée, définir toutes les routes CRUD (create, read, update, delete).

```javascript
app.route('/book')
  .get( (req, res) => {
    res.send('Un livre')
  })
  .post( (req, res) => {
    res.send('Sauvegarde du livre')
  })
  .put( (req, res) => {
    res.send('Mise à jour du livre')
  })
  .delete( (req, res) => {
    res.send('Suppression du livre')
  })
  ```