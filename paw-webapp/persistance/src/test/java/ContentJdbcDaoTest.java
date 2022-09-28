import ar.edu.itba.paw.models.Content;
import ar.edu.itba.paw.persistance.ContentJdbcDao;
import config.TestConfig;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.junit.runner.RunWith;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;

import java.util.List;
import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@Transactional
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = TestConfig.class)
@Sql(scripts = "classpath:content-dao-test.sql")
public class ContentJdbcDaoTest {

    @Autowired
    private DataSource ds;
    @Autowired
    private ContentJdbcDao dao;
    private JdbcTemplate jdbcTemplate;
    @Before
    public void setUp() {
        this.jdbcTemplate = new JdbcTemplate(ds);
    }

    @Test
    public void testGetAllContent(){
        assertEquals(6, dao.getAllContent("ANY", "ANY").size());

    }


    @Test
    public void  GetAllContentSort(){
        List<Content> contentList=dao.getAllContent("ANY","A-Z");
        assertEquals(6, contentList.size());
        assertEquals("Avrupa Yakasi", contentList.get(0).getName());
    }
    @Test
    public void  GetAllContentType(){
        List<Content> contentList=dao.getAllContent("movie","ANY");
        assertEquals(4, contentList.size());
    }

    @Test
    public void findByNameTest(){
        Optional<Content> contentOptional=dao.findByName("Toy Story 2");
        assertTrue(contentOptional.isPresent());
        assertEquals(501, contentOptional.get().getId());
    }

    @Test
    public void findByGenreTest(){
        List<Content> contentList=dao.findByGenre("all","Animation","ANY");
        assertEquals(2, contentList.size());
    }

    @Test
    public void findByIdTest(){
        Optional<Content> contentOptional=dao.findById(501);
        assertTrue(contentOptional.isPresent());
        assertEquals("Toy Story 2", contentOptional.get().getName());
    }

    @Test
    public void findByTypeTest(){
        List<Content> contentList=dao.findByType("movie");
        assertEquals(4, contentList.size());
    }

    @Rollback
    @Test
    public void addPointsTest(){
        dao.addContentPoints(501,5);
        dao.addContentPoints(501,3);
        Optional<Content> contentOptional=dao.findById(501);
        assertTrue(contentOptional.isPresent());
        assertEquals(4, (int) contentOptional.get().getRating());
    }

    @Rollback
    @Test
    public void decreasePointsTest(){
        dao.addContentPoints(501,5);
        dao.decreaseContentPoints(501,4);
        Optional<Content> contentOptional=dao.findById(501);
        assertTrue(contentOptional.isPresent());
        assertEquals(1, (int) contentOptional.get().getRating());
    }

    @Test
    public void getBestRatedTest(){
        List<Content> contentList=dao.getBestRated();
        assertEquals(1, contentList.size());
        assertEquals(172, contentList.get(0).getId());
    }

    @Test
    public void getLessDuration(){
        List<Content> contentList=dao.getLessDuration("movie");
        assertEquals(4, contentList.size());
        assertEquals(172, contentList.get(0).getId());
    }

    @Test
    public void getLastAdded(){
        List<Content> contentList=dao.getLastAdded();
        assertEquals(6, contentList.size());
        assertEquals(501, contentList.get(0).getId());
    }

    @Test
    @Rollback
    public void createContentTest(){
        dao.contentCreate("new","description","2022","Animation","brandyhuevo",100,"100","movie",null);
        assertEquals(7, dao.getAllContent("ANY", "ANY").size());
        assertTrue(dao.findByName("new").isPresent());
        assertEquals(3, dao.findByGenre("all", "Animation", "ANY").size());
    }




}
