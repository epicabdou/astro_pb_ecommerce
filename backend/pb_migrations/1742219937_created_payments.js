/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "@request.auth.id != \"\"",
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_3527180448",
        "hidden": false,
        "id": "relation4113142680",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "order",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "relation2375276105",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "user",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "number2392944706",
        "max": null,
        "min": null,
        "name": "amount",
        "onlyInt": false,
        "presentable": false,
        "required": true,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "select2223302008",
        "maxSelect": 1,
        "name": "paymentMethod",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "credit_card",
          "paypal",
          "bank_transfer"
        ]
      },
      {
        "hidden": false,
        "id": "select2063623452",
        "maxSelect": 1,
        "name": "status",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "pending",
          "completed",
          "failed"
        ]
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_631030571",
    "indexes": [],
    "listRule": "user.id = @request.auth.id || @request.auth.isAdmin = true",
    "name": "payments",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.isAdmin = true",
    "viewRule": "user.id = @request.auth.id || @request.auth.isAdmin = true"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_631030571");

  return app.delete(collection);
})
