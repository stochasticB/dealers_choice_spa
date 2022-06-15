const Sequelize = require('sequelize')
const { STRING, BOOLEAN, UUID, UUIDV4 } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_express_spa');

const Friend = conn.define('friend', {
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    name: STRING,
});

const Watch = conn.define('watch', {
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    name: STRING,
});

const Sale = conn.define('sale', {
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    extendedWarranty: {
        type: BOOLEAN,
        defaultValue: false
    }
});

Sale.belongsTo(Friend);
Sale.belongsTo(Watch);

const syncAndSeed = async() => {
    await conn.sync({ force: true });
    const [John, Nick, Slava, Dan, Yakov, Dima] = await Promise.all(
        ['John', 'Nick', 'Slava', 'Dan', 'Yakov', 'Dima'].map( name => Friend.create( { name }))
        );

    const [ Reverso, Khaki, Oyster, Pelagos, Seiko5, Explorer1, Mako, Explorer2] = await Promise.all(
        ['Reverso Grande Date Manual Steel', 'Khaki Field', 'Oyster Perpetual White', 'Pelagos Titanium Automatic Black',
            'Seiko 5', 'Explorer 1', 'Mako 2 USA', 'Explorer 2'].map( name => Watch.create({name}))
    );
     
    const sales = await Promise.all([
        Sale.create({ friendId: John.id, watchId: Reverso.id}),
        Sale.create({ friendId: Nick.id, watchId: Explorer1.id}),
        Sale.create({ friendId: Slava.id, watchId: Pelagos.id})
    ]);
};

module.exports = {
    models: {
        Friend,
        Watch,
        Sale
    },
    conn,
    syncAndSeed
};