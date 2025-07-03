const SequelizeAuto = require('sequelize-auto');

const auto = new SequelizeAuto('allfill', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  directory: './models',
  port: '3306',
  additional: {
    timestamps: false,
  },
});

auto.run((err) => {
  if (err) {
    console.error("Error generating models:", err);
    process.exit(1);
  }
  console.log('Models generated successfully!');
});
