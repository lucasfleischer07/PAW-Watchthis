package ar.edu.itba.paw.persistance;

import ar.edu.itba.paw.models.Serie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.util.List;
import java.util.Optional;

@Repository
public class SerieJdbcDao implements SerieDao {
    private static final RowMapper<Serie> SERIE_ROW_MAPPER = (resultSet, rowNum) ->
            new Serie(resultSet.getLong("serieid"),
                    resultSet.getString("name"),
                    resultSet.getString("image"),
                    resultSet.getString("description"),
                    resultSet.getString("released"),
                    resultSet.getString("genre"),
                    resultSet.getString("creator"),
                    resultSet.getString("duration"));

    private final JdbcTemplate template;
//    private final SimpleJdbcInsert insert;

    @Autowired
    public SerieJdbcDao(final DataSource ds){
        this.template = new JdbcTemplate(ds);
//        this.insert = new SimpleJdbcInsert(ds)
//                .withTableName("users")
//                .usingGeneratedKeyColumns("id");
//
//        //Hacer esto NO esta bueno, ya va a mostrar una mejor forma
//        template.execute("CREATE TABLE IF NOT EXISTS users ("
//                + "id SERIAL PRIMARY KEY,"
//                + "email VARCHAR(255) UNIQUE NOT NULL,"
//                + "password VARCHAR(255) NOT NULL"
//                + ")");
    }

    @Override
    public List<Serie> getAllSeries() {
        return template.query("SELECT * FROM series", SERIE_ROW_MAPPER);
    }

    @Override
    public Optional<Serie> findByName(String name) {
        // Hacer esto esta MAL por SQL Injection
        // NO hay que concatenar variables en una query
        //template.query("SELECT * FROM users WHERE email = " + email, null);

        return template.query("SELECT * FROM series WHERE name = ?",
                new Object[]{ name }, SERIE_ROW_MAPPER
        ).stream().findFirst();
    }

    @Override
    public List<Serie> findByGenre(String genre) {
        // TODO: Ver como hacer para que, dentro de los genereos, que me agarre 1 de todos los que tiene
        return template.query("SELECT * FROM series WHERE genre LIKE '%'||?||'%'", new Object[]{ genre }, SERIE_ROW_MAPPER);
    }

    @Override
    public List<Serie> findByDuration(int durationFrom, int durationTo) {
        // Hacer esto esta MAL por SQL Injection
        // NO hay que concatenar variables en una query
        //template.query("SELECT * FROM users WHERE email = " + email, null);
        // TODO: Aca, cuando definamos para hacer la consulta, tiene que ser en el sigueinte formato: 2 horas 22 minutos, es decir, numero horas numero minuto
        return template.query("SELECT * FROM series WHERE durationnum > ? AND durationnum <= ?", new Object[]{ durationFrom, durationTo }, SERIE_ROW_MAPPER);
    }

    @Override
    public List<Serie> findByDurationAndGenre(String genre, int durationFrom, int durationTo){
        return template.query("SELECT * FROM series WHERE durationnum > ? AND durationnum <= ? and genre LIKE '%'||?||'%'", new Object[]{ durationFrom, durationTo,genre }, SERIE_ROW_MAPPER);
    }

    @Override
    public Optional<Serie> findById(long id) {
        return template.query("SELECT * FROM series WHERE serieId = ?",
                new Object[]{ id }, SERIE_ROW_MAPPER
        ).stream().findFirst();
    }

    @Override
    public List<Serie> getSearchedSeries(String query) {
        List<Serie> series =  template.query("SELECT * FROM series WHERE LOWER(name) LIKE ? ",
                new Object[]{"%" + query.toLowerCase() + "%"},SERIE_ROW_MAPPER);
        return series;
    }



    @Override
    public List<Serie> ordenByAsc(String parameter) {
        return template.query("SELECT * FROM series order by ? asc ", new Object[]{ parameter }, SERIE_ROW_MAPPER);

    }

    @Override
    public List<Serie> ordenByDesc(String parameter) {
        return template.query("SELECT * FROM series order by ? desc ", new Object[]{ parameter }, SERIE_ROW_MAPPER);
    }
}
