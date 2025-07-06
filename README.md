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

# Le middleware Morgan

Morgan est un logger pour les requêtes Http qui est maintenu par l'équipe d'Express. 