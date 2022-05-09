'use strict';
module.exports = function(sequelize, DataTypes) {
    // Creating Table to store generated otp codes and setting date
	
	return sequelize.define('OTP', {
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
		},
       
		otp: DataTypes.STRING,
		expiration_time: DataTypes.DATE,
		verified: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: true
		},
        // user_id : {
        //     type : DataTypes.INTEGER,
        //     allowNull:false,
        //     references : {
        //         key : id, 

        //     }
        // },
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('now')
		},

		updated_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('now')
		}     
		}, {
			tableName: 'OTP',
            modelName: 'OTP',
		});

        return otp;


	};