
import sqlite3
from flask import Flask, request, render_template, redirect, jsonify #Flask, g, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy

# from contextlib import closing
from hashids import Hashids
hash_ids = Hashids(salt='URRrLs are not so salty', min_length=7)

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/urrl.db'
db = SQLAlchemy(app)

# try:
#     app.config.from_pyfile('config.py')
# except:
#     app.config.from_envvar('URRL_SETTINGS', silent=True)

class Urrl(db.Model):
    id = db.Column(db.Integer, primary_key=True) # by default uses SERIAL sequence
    url = db.Column(db.String(250), unique=True, nullable=False)
    alias = db.Column(db.String(16))
    hits = db.Column(db.Integer)

    def __init__(self, url):
        self.url = url
        self.hits = 0
        self.alias = hash_ids.encode(Urrl.query.count() + 1) # FIXME
        print 'Urrl record created.'

    def __repr__(self):
        return '<Urrl %r => /%r (%d)>' % (self.url, self.alias, self.hits)

@app.route('/', methods=['GET'])
def get_root():
    return render_template('index.html', urrls = Urrl.query.all())

@app.route('/index.json', methods=['GET'])
def get_json_for_urrls():
    # cur = g.db.execute('select url, alias, hits from urrls order by id desc')
    # entries = [dict(title=row[0], text=row[1]) for row in cur.fetchall()]
    print jsonify(json_list=Urrl.query.all())
    return jsonify(json_list=Urrl.query.all())

@app.route('/', methods=['POST'])
def create_alias():
    url = request.form['url']
    new_urrl = Urrl(url)

    # try:
    db.session.add(new_urrl)
    db.session.commit()
    msg = 'New URrL was successfully created for %s.' % url
    # flash(msg)
    print msg
    return jsonify(url=new_urrl.url, alias=new_urrl.alias, hits=new_urrl.hits)
    # except:
    #     print 'Excepting:'
    #     msg = 'New URrL was not created for %s.' % url
    #     flash(msg)
    #     print msg
    #     return redirect('/')

@app.route('/<alias>')
def lookup(alias):
    print 'Looking up %s' % alias
    # look up whether alias exists
    lookup = Urrl.query.filter_by(alias=alias).first()
    # if so, redirect to it
    if lookup:
        lookup.hits += 1
        db.session.commit()
        return redirect(lookup.url)
    else:
        # flash('No such alias')
        print 'No such alias: %s' % alias
        return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)
