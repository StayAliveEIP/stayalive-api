# Algorithme d'attribution d'urgence


## Description
L'algorithme d'attribution d'urgence a pour but de trouver un utilisateur de type ***urgentiste*** à proximité (5 min a pied) du lieu defini dans l'urgence.
Cet utilisateur sera selectioné et aura le choix d'accepter ou non d'aller à la position de l'urgence afin d'aider la personne en danger.


## Fonctionnement

### Position des sauveteurs

Chaque sauveteur transmet sa position afin que l'algorithme puisse l'utiliser.


**PATH**
````
POST /rescuer/position                            
````

**OBJECT**
```
latitude: 90
longitude: 90
```

Ces positions sont stockés en cache sur le serveur REDIS

![Exemple de donnée de positions stockées sur REDIS](img.png)


### Disponibilité des sauveteurs

Chaque sauveteur transmet sa disponibilité afin que l'algorithme puisse l'utiliser.
La disponibilité indique si le sauveteur est disponible ou non a recevoir une mission d'urgence.


**PATH**
````
POST /rescuer/status                        
````

**OBJECT**
```ts
status: AVAILABLE
```

Ces disponibilités sont stockés en cache sur le serveur REDIS

![Exemple de donnée de dispos stockées sur REDIS](img_1.png)


### Reception de l'urgence

### Recuperation du sauveteur le plus proche

 Avec l'ensemble des postions des sauveteurs et les disponibilité sur le cache REDIS, nous pouvons trouver le sauveteur le plus proche.

Lorsque l'urgence est recuperé, cette operation commence.

#### Recuperation des rescuers
 Une fonction appelé **getAllPositions** renvoi un tableau contenant les sauveteurs de type **RescuerPositionWithId[]**

```ts
interface RescuerPositionWithId {
  id: Types.ObjectId;
  position: RescuerPosition;
}
```

#### Recuperation de la position la plus proche de l'urgence

une fonction appelé **getNearestPositionGoogle** renvoi la postion la plus proche de l'urgence de type **RescuerPositionWithId**

```ts
interface RescuerPositionWithId {
  id: Types.ObjectId;
  position: RescuerPosition;
}
```
<br></br>
*Input and Output Schema*
```
RescuerPositionWithId[] -> getNearestPositionGoogle() -> RescuerPositionWithId
```  


### Service Google

L'ensemble des ces services utilisent [l'API Google](https://console.cloud.google.com/apis/library)

L'API Google offre plusieurs services de géolocalisation qui sont essentiels pour le bon fonctionnement de l'application StayAlive. Ces services permettent de localiser les utilisateurs, de calculer des itinéraires optimisés pour les volontaires, et d'assurer une gestion efficace des interventions d'urgence. Voici les services que nous utilisons dans notre API :

1. **Geocoding API**\
   Cette API convertit les adresses physiques en coordonnées géographiques (latitude et longitude) et vice versa. Cela permet de localiser précisément les utilisateurs et les points d'intérêt sur une carte. Dans StayAlive, cela pourrait être utilisé pour identifier la position d'une urgence par rapport à l'emplacement d'un volontaire.
2. **Places API**\
   L'API Places est utilisée pour rechercher des lieux tels que des hôpitaux, des pharmacies, ou d'autres installations médicales à proximité. Cela peut être essentiel pour aider les volontaires et les utilisateurs à trouver les ressources nécessaires rapidement.
3. **Distance Matrix API**\
   Cette API calcule les distances et le temps de trajet entre plusieurs points. Elle peut être utilisée pour déterminer le volontaire le plus proche de l'emplacement d'une urgence et estimer le temps d'arrivée.

### Résumé/Cooldown

**Sélection initiale** : Lorsqu'une urgence est signalée, l'application sélectionne un secouriste volontaire à proximité pour intervenir.

**Délai de réponse (cooldown)** : Une fois sélectionné, le secouriste a un délai de 45 secondes pour accepter ou refuser l'intervention. Pendant ce délai, le secouriste reçoit une notification sur son appareil mobile lui demandant de confirmer sa disponibilité pour se rendre sur le lieu de l'urgence.

**Expiration du délai** : Si le secouriste ne répond pas dans les 45 secondes, il est considéré comme indisponible. L'application passe alors au prochain secouriste disponible le plus proche pour lui proposer l'intervention.

**Sélection d'un autre secouriste** : Le processus se répète jusqu'à ce qu'un secouriste accepte l'intervention. Cela garantit une réponse rapide et efficace, en minimisant le temps perdu en cas d'indisponibilité d'un volontaire initialement sélectionné.



