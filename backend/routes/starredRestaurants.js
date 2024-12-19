const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const ALL_RESTAURANTS = require("./restaurants").restaurants;

let STARRED_RESTAURANTS = [
  {
    id: "a7272cd9-26fb-44b5-8d53-9781f55175a1",
    restaurantId: "869c848c-7a58-4ed6-ab88-72ee2e8e677c",
    comment: "Best pho in NYC",
  },
  {
    id: "8df59b21-2152-4f9b-9200-95c19aa88226",
    restaurantId: "e8036613-4b72-46f6-ab5e-edd2fc7c4fe4",
    comment: "Their lunch special is the best!",
  },
];

// Feature 6: Getting the list of all starred restaurants.
router.get("/", (req, res) => {
  const joinedStarredRestaurants = STARRED_RESTAURANTS.map((starred) => {
    const restaurant = ALL_RESTAURANTS.find(
      (rest) => rest.id === starred.restaurantId
    );
    return restaurant
      ? {
          id: starred.id,
          comment: starred.comment,
          name: restaurant.name,
        }
      : null;
  }).filter(Boolean); // Filter out any null values in case of inconsistencies.

  res.json(joinedStarredRestaurants);
});

// Feature 7: Getting a specific starred restaurant.
router.get("/:id", (req, res) => {
  const { id } = req.params;


  const restaurant = STARRED_RESTAURANTS.find((restaurant) => restaurant.id === id);


  if (!restaurant) {
    res.sendStatus(404);
    return;
  }

  res.json(restaurant);
});

// Feature 8: Adding to your list of starred restaurants.
router.post("/", (req, res) => {
  const { body } = req;
  const { id } = body;

  const restaurant = ALL_RESTAURANTS.find((restaurant) => restaurant.id === id);

  if (!restaurant) {
    res.sendStatus(404);
    return;
  }

  // Generate a unique id for the new starred restaurant
  const newId = uuidv4();

  // Create a record for the new starred restaurant
  const newStarredRestaurant = {
    id: newId,
    restaurantId: restaurant.id,
    comment: null
  };

  // Push the new record into STARRED_RESTAURANTS
  STARRED_RESTAURANTS.push(newStarredRestaurant);

  res.status(200).send({
	id: newStarredRestaurant.id,
	comment: newStarredRestaurant.comment,
	name: restaurant.name
  });
})


// Feature 9: Deleting from your list of starred restaurants.
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const newListOfStarredRestaurants = STARRED_RESTAURANTS.filter(
    (restaurant) => restaurant.id !== id
  )

  if (STARRED_RESTAURANTS.length === newListOfStarredRestaurants.length) {
    res.sendStatus(404);
    return;
  }

  STARRED_RESTAURANTS = newListOfStarredRestaurants;

  res.sendStatus(200)
});

// Feature 10: Updating your comment of a starred restaurant.
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;


  const restaurant = STARRED_RESTAURANTS.find((restaurant) => restaurant.id === id);

  if (!restaurant) {
    res.sendStatus(404);
    return;
  }

  restaurant.comment = comment;
  res.status(200);
});

module.exports = router;
