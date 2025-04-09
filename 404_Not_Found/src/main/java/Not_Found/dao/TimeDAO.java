package Not_Found.dao;

import java.util.Random;

import Not_Found_Mapper.TimeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;



@Repository //@Component의 자식 Annotation으로 DAD에 사용
public class TimeDAO {
	
	@Autowired
	private TimeMapper mapper;
	
	public String getTime() {

		
		return mapper.getTime1();	
		
	}
}
