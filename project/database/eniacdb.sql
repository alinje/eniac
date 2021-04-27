\set QUIET true
SET client_min_messages TO WARNING; -- Less talk please.
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
\set QUIET false

CREATE TABLE Managers(
    name TEXT,

    PRIMARY KEY (name)
);

CREATE TABLE Stocks (
    name TEXT,
    price INTEGER,
    country TEXT,
    percent DECIMAL(7,2),

    PRIMARY KEY(name)
);

CREATE TABLE Labels(
    name TEXT,
    PRIMARY KEY(name)
);

CREATE TABLE StocksWithLabels(
    stock TEXT,
    label TEXT,
    weight DECIMAL(2,1),

    PRIMARY KEY(stock,label),
    FOREIGN KEY(stock) REFERENCES Stocks(name),
    FOREIGN KEY(label) REFERENCES Labels(name),
    CHECK (weight>0 AND weight<=3)
);

CREATE TABLE Portfolios(
    manager TEXT,
    stock TEXT,
    volume INTEGER,

    PRIMARY KEY (manager,stock),
    FOREIGN KEY (manager) REFERENCES Managers(name),
    FOREIGN KEY (stock) REFERENCES Stocks(name)
);

INSERT INTO Stocks VALUES('Tesla',120,'USA',-0.14);
INSERT INTO Stocks VALUES('Volvo',125,'SE',0.14);
INSERT INTO Stocks VALUES('Scania',122,'SE',0.15);
INSERT INTO Stocks VALUES('Snapchat',121,'USA',0.16);
INSERT INTO Stocks VALUES('Einride',123,'GER',0.17);

INSERT INTO Labels VALUES('coronavinnare');
INSERT INTO Labels VALUES('coronaförlorare');
INSERT INTO Labels VALUES('kort');
INSERT INTO Labels VALUES('lång');
INSERT INTO Labels VALUES('bred');
INSERT INTO Labels VALUES('smal');

INSERT INTO Managers VALUES('Alex');
INSERT INTO Managers VALUES('Albin');
INSERT INTO Managers VALUES('Carl');
INSERT INTO Managers VALUES('Emil');
INSERT INTO Managers VALUES('Aline');

INSERT INTO StocksWithLabels VALUES('Tesla','kort', 0.5);
INSERT INTO StocksWithLabels VALUES('Volvo','lång', 1);
INSERT INTO StocksWithLabels VALUES('Scania','coronavinnare', 1.3);
INSERT INTO StocksWithLabels VALUES('Snapchat','coronaförlorare', 0.7);
INSERT INTO StocksWithLabels VALUES('Einride','bred', 0.9);
INSERT INTO StocksWithLabels VALUES('Einride','lång', 1.1);

INSERT INTO Portfolios VALUES('Alex','Volvo',100);
INSERT INTO Portfolios VALUES('Alex','Tesla',312);
INSERT INTO Portfolios VALUES('Alex','Snapchat',234);
INSERT INTO Portfolios VALUES('Alex','Scania',654);
INSERT INTO Portfolios VALUES('Albin','Volvo',43);
INSERT INTO Portfolios VALUES('Albin','Scania',654);
INSERT INTO Portfolios VALUES('Albin','Einride',345);
INSERT INTO Portfolios VALUES('Carl','Einride',1234);
INSERT INTO Portfolios VALUES('Carl','Volvo',123);
INSERT INTO Portfolios VALUES('Emil','Snapchat',123);

CREATE VIEW PortfolioInfo AS 
(SELECT manager, Portfolios.stock, StocksWithLabels.label AS label, weight, country, percent, volume, price*volume AS amount, price*volume*weight AS exposure
FROM Managers, Portfolios, Stocks, StocksWithLabels
WHERE (Managers.name = Portfolios.manager) AND (Portfolios.stock = StocksWithLabels.stock)
                                           AND (Portfolios.stock = Stocks.name)
GROUP BY(Portfolios.manager, StocksWithLabels.label, country, Portfolios.stock,percent,amount,weight)
);
