import { Sequelize,DataTypes } from "sequelize";

export const DocumentModel = (sequelize: Sequelize) => {
    const documents = sequelize.define('documents', {
        document_id  : {
            type : DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull:false
        },
        original_name : {
            type : DataTypes.STRING,
            allowNull:false
        },
        file_name  : {
            type : DataTypes.STRING,
            allowNull:false
        },
        path : {
            type : DataTypes.STRING,
            allowNull:false
        },
        size : {
            type : DataTypes.STRING,
            allowNull:false
        },
        mime_type  : {
            type : DataTypes.STRING,
            allowNull:false    
        },
        date_creation  : {
            type : DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull:false    
        },
    },{
        freezeTableName: true ,// Désactive la pluralisation automatique
        schema: 'file', // Spécifie le schéma
        timestamps : false // Désactive les colonnes createdAt et updatedAt
    });
    return documents;
}