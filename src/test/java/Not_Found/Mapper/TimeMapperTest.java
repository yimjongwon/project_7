package Not_Found.Mapper;

import Not_Found.mapper.TimeMapper;
import Not_Found.util.MyUtil;
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
    public void testGetTime1(){
        log.info(MyUtil.BLUE + MyUtil.BOLD + "현재 시간 : {}" + MyUtil.END, mapper.getTime1());
    }
}
