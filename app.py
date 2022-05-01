"""Flask app for Cupcakes"""
from flask import Flask, request, render_template, jsonify, redirect, flash, session
from models import db, connect_db, Cupcake

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = "somethinginappropriate"

connect_db(app)


@app.route('/')
def index_page():
    cupcakes = Cupcake.query.all()
    return render_template('index.html', cupcakes=cupcakes)



@app.route('/api/cupcakes')
def list_cupcakes():
    """Get data about all cupcakes"""

    all_cupcakes=[cupcake.serialize() for cupcake in Cupcake.query.all()]
    return jsonify(cupcakes=all_cupcakes)



@app.route('/api/cupcakes/<int:id>')
def get_cupcake():
    """Get data about a single cupcake"""

    cupcake = Cupcake.query.get_or_404(id)
    return jsonify(cupcake=cupcake.serialize())



@app.route('/api/cupcakes', methods=['POST'])
def create_cupcake():
    """Create a cupcake with data from the body of the request"""

    new_cupcake = Cupcake(
        flavor=request.json["flavor"], 
        size=request.json["size"], 
        rating=request.json["rating"], 
        image=request.json["image"] or None)

    db.session.add(new_cupcake)
    db.session.commit()
    res_json = jsonify(new_cupcake=new_cupcake.serialize())

    return (res_json, 201)



@app.route('/api/cupcakes/<int:id>', methods=['PATCH'])
def edit_cupcake():
    """Update a cupcake with the id passed in the URL and data from the body of the request."""

    cupcake = Cupcake.query.get_or_404(id)
    get_json = request.json.get

    cupcake.flavor = get_json("flavor", cupcake.flavor)
    cupcake.size = get_json("size", cupcake.size)
    cupcake.rating = get_json("rating", cupcake.rating)
    cupcake.image = get_json("image", cupcake.image)

    db.session.commit()
    return jsonify(cupcake=cupcake.serialize())



@app.route('/api/cupcakes/<int:id>', methods=['DELETE'])
def delete_cupcake():
    """Delete cupcake with the id passed in the URL"""

    cupcake = Cupcake.query.get_or_404(id)
    db.session.delete(cupcake)
    db.session.commit()
    return jsonify(message="deleted")
