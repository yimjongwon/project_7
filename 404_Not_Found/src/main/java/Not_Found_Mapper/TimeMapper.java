package Not_Found_Mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper        // MyBatis 연결
public interface TimeMapper {
    public String getTime1();
}

