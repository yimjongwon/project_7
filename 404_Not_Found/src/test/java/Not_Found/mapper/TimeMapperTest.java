package Not_Found.mapper;

import Not_Found.util.MyUtil;
import Not_Found_Mapper.TimeMapper;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Slf4j
public class TimeMapperTest {

    @Autowired
    private TimeMapper mapper;

    @Test
    public void testGetTime1() {
        log.info("----------------------------");
        log.info("Current Time 1 : " + MyUtil.BLUE + MyUtil.BOLD + mapper.getTime1() + MyUtil.END);
        log.info("----------------------------");

    }

}
