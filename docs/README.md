# Wojewodztwa Chart (WordPress plugin)

A shortcode (`wojewodztwa_chart`) to display a chart with Polish voivodships with data from a given URL.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Current WordPress (tested on 3.9.5).

### Installing

The development version can be installed by putting the `wp-wojewodztwa-chart` directory (with all the files) in `wp-content/plugins/`.

When using a Linux console:

```
cd $HOME
git clone https://github.com/tomaszn/wp-wojewodztwa-chart.git
ln -s wp-wojewodztwa-chart/wp-wojewodztwa-chart www/wp-content/plugins/
```

Log in as administrator to WP, check if the plugin is on the list and `Activate` it.

## Supported shortcode parameters

Shortcode name: `wojewodztwa_chart`

* data: URL to TSV file, see example below
* column: column name from data file

Data files are TSV:
```
WOJEWÓDZTWO	AVG_FWQ	SUM_KL
dolnośląskie	110.16	159
...
```
Example:
```
[wojewodztwa_chart data="https://mysite.pl/wp-content/uploads/2018/04/mapa_testowe_dane.tsv" column="AVG_FWQ"]
```

## Authors

* **Tomasz Nowak** - *Initial work* - [tomaszn](https://github.com/tomaszn)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the GPLv2 license - see the [LICENSE](LICENSE) file for details.
