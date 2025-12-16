package com.mxhieu.doantotnghiep.converter;

import com.mxhieu.doantotnghiep.dto.response.UserRespone;
import com.mxhieu.doantotnghiep.entity.RoleEntity;
import com.mxhieu.doantotnghiep.entity.UserEntity;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserConverter {
    @Autowired
    ModelMapper modelMapper;

    public UserRespone toInForUser(UserEntity userEntity, List<RoleEntity> roles) {
        UserRespone result = modelMapper.map(userEntity, UserRespone.class);
        result.setRoles(roles.stream().map(roleEntity -> roleEntity.getValue()).toList());
        return result;
    }

}
