var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
function initPlanta(db){
	var plantasColl = db.collection('incidentes');
	//buscar todo
	router.get('/', (req, res, next)=>{
		plantasColl.find().toArray((err, plantas)=>{
			if(err){
				console.log(err);
				return res.status(404).json({"error":"error al extraer los datos de la base de datos"});
			}
			return res.status(200).json(plantas);
		});

	});
	//buscar por id
	router.get('/:id', (req, res, next)=>{
		var id = new ObjectID(req.params.id);
		plantasColl.findOne({"_id": id}, (err, doc)=>{
			if(err){
				console.log(err);
				return res.status(404).json({"error":"No se puede Obtener intente de nuevo"});
			}
			return res.status(200).json(doc);
		});

	});
//agregando
	router.post('/', (req, res, next)=>{
		var newPlanta = Object.assign(
			{},
			{
				"descripcion":"",
				"fechaHora": new Date().getTime(),
				"tipo":0,
				"estado":0,
				"usuarioRegistra":"",
				"usuarioAsignado":"",
				"fechaHoraAsignado": new Date().getTime(),
				"fechaHoraCerrado": new Date().getTime()
				

			},
			req.body
		);
		plantasColl.insertOne(newPlanta, (err, rslt)=>{
			if(err){
				console.log(err);
				return res.status(404).json({"error":"No se pudo agregar uno nuevo"});
			}
			if(rslt.ops.lengt===0){
				console.log(rslt);
				return res.status(404).json({"error":"No se pudo agregar uno nuevo"});
			}
			return res.status(200).json(rslt.ops[0]);
		});
	});
	//actualizando
	router.put('/:id', (req, res, next)=>{
		var query = {"_id":new ObjectID(req.params.id)};
		var update = {"$inc":{"tipo":1, "estado":1}};

		plantasColl.updateOne(query, update, (err, rslt)=>{
			if(err){
				console.log(err);
				return res.status(404).json({"error":"No se pudo modificar uno nuevo"});
			}
			return res.status(200).json(rslt);
		});
	});
	//eliminando
		router.delete('/:id', (req, res, next)=>{
		var query = {"_id":new ObjectID(req.params.id)};

		plantasColl.removeOne(query, (err, rslt)=>{
			if(err){
				console.log(err);
				return res.status(404).json({"error":"No se pudo eliminar uno nuevo"});
			}
			return res.status(200).json(rslt);
		});
	});
	return router;
}

module.exports= initPlanta;