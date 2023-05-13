package ar.edu.itba.paw.webapp.controller;

import ar.edu.itba.paw.webapp.exceptions.UserNotFoundException;
import ar.edu.itba.paw.models.PageWrapper;
import ar.edu.itba.paw.models.Review;
import ar.edu.itba.paw.models.User;
import ar.edu.itba.paw.services.*;
import ar.edu.itba.paw.webapp.dto.request.EditProfileDto;
import ar.edu.itba.paw.webapp.dto.request.NewUser;
import ar.edu.itba.paw.webapp.dto.response.ReviewDto;
import ar.edu.itba.paw.webapp.dto.response.UserDto;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.util.*;

@Path("users")
@Component
public class UserController {
    @Autowired
    private UserService us;
    @Autowired
    private ReviewService rs;
    @Context
    private UriInfo uriInfo;
    private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);
    private static final int REVIEW_AMOUNT = 3;


    // * ----------------------------------------------- User POST -----------------------------------------------------
    // Endpoint para crear un usuario
    @POST
    @Produces(value = {MediaType.APPLICATION_JSON})
    public Response userCreate(@Valid final NewUser newUser) {
        LOGGER.info("POST /{}: Called", uriInfo.getPath());
        final User user = us.register(newUser.getEmail(), newUser.getUsername(), newUser.getPassword()).orElseThrow(UserNotFoundException::new);
        UserDto userDto = new UserDto(uriInfo, user);
        LOGGER.info("POST /{}: New user created with id {}", uriInfo.getPath(), user.getId());
        return Response.created(UserDto.getUserUriBuilder(user, uriInfo).build()).entity(userDto).build();
    }

    // * ---------------------------------------------------------------------------------------------------------------


    // * ----------------------------------------------- User GET ------------------------------------------------------
    // Endpoint para getear la informacion del usuario
    @GET
    @Produces(value = {MediaType.APPLICATION_JSON})
    @Path("/{id}")
    public Response getUserInfo(@PathParam("id") final long id) {
        LOGGER.info("GET /{}: Called",  uriInfo.getPath());
        final User user = us.findById(id).orElseThrow(UserNotFoundException::new);
        LOGGER.info("GET /{}: User returned with success", uriInfo.getPath());
        return Response.ok(new UserDto(uriInfo, user)).build();
    }

    @GET
    @Produces(value = {MediaType.APPLICATION_JSON})
    @Path("/loggedUser")
    public Response getLoggedUserInfo() {
        LOGGER.info("GET /{}: Called",  uriInfo.getPath());
        final Optional<User> user = us.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName());
        if(!user.isPresent()) {
            LOGGER.warn("GET /{}: User not logged", uriInfo.getPath());
            return Response.noContent().build();
        }
        LOGGER.info("GET /{}: User returned with success", uriInfo.getPath());
        return Response.ok(new UserDto(uriInfo, user.get())).build();
    }

    // Endpoint para getear las reviews del usuario
    @GET
    @Produces(value = {MediaType.APPLICATION_JSON})
    @Path("/{id}/reviews")
    public Response getUserReviews(@PathParam("id") final long id,
                                   @QueryParam("page")@DefaultValue("1")final int page) {
        LOGGER.info("GET /{}: Called",  uriInfo.getPath());
        final User user = us.findById(id).orElseThrow(UserNotFoundException::new);
        PageWrapper<Review> reviewList = rs.getAllUserReviews(user,page,REVIEW_AMOUNT);
        Collection<ReviewDto> reviewDtoList = ReviewDto.mapReviewToReviewDto(uriInfo, reviewList.getPageContent());
        LOGGER.info("GET /{}: User {} reviews returned with success",  uriInfo.getPath(), id);
        return Response.ok(new GenericEntity<Collection<ReviewDto>>(reviewDtoList){}).build();
    }

    // * ---------------------------------------------------------------------------------------------------------------

    // * ----------------------------------------------- User Image ----------------------------------------------------

    // Endpoint para getear la imagen del usuario

    @GET
    @Produces(value = {"image/*", MediaType.APPLICATION_JSON})
    @Path("/{id}/profileImage")
    @Cacheable
    public Response getUserProfileImage(@PathParam("id") final long id,
                                        @Context Request request) {
        LOGGER.info("GET /{}: Called", uriInfo.getPath());

        final User user = us.findById(id).orElseThrow(UserNotFoundException::new);
        if(user.getImage() == null) {
            return Response.noContent().build();
        }

        EntityTag eTag = new EntityTag(String.valueOf(user.getId()));
        final CacheControl cacheControl = new CacheControl();
        cacheControl.setNoCache(true);
        Response.ResponseBuilder response = request.evaluatePreconditions(eTag);

        if (response == null) {
            final byte[] userImage = user.getImage();
            response = Response.ok(userImage).tag(eTag);
        }

        LOGGER.info("GET /{}: User {} Profile Image", uriInfo.getPath(), id);

        return response.cacheControl(cacheControl).build();
    }

//    Endpoint para editar la imagen de perfil del usuario
    @PUT
    @Path("/{id}/profileImage")
    @Produces({"image/*", MediaType.APPLICATION_JSON,})
    public Response updateUserProfileImage(@FormDataParam("image") byte[] imageBytes,
                                           @PathParam("id") final long id) {
        LOGGER.info("PUT /{}: Called", uriInfo.getPath());
        if(imageBytes==null)
            throw new BadRequestException("Must include image data");
        final User user = us.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).orElseThrow(UserNotFoundException::new);
        if(user.getId() != id) {
            throw new ForbiddenException();
        }

        us.setProfilePicture(imageBytes, user);
        LOGGER.info("PUT /{}: User {} Profile Image Updated", uriInfo.getPath(), id);
        return Response.noContent().contentLocation(UserDto.getUserUriBuilder(user, uriInfo).path("profileImage").build()).build();
    }

    // * ---------------------------------------------------------------------------------------------------------------


    // * ------------------------------------------------Profile Edition------------------------------------------------
    // Endpoint para editar la informacion del usuario
    @PUT
    @Path("/{id}/editProfile")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(value = {MediaType.APPLICATION_JSON,})
    public Response updateUserProfileInfo(@Valid EditProfileDto editProfileDto,
                                          @PathParam("id") final long id) {
        LOGGER.info("PUT /{}: Called", uriInfo.getPath());
        if(editProfileDto == null) {
            throw new BadRequestException("Must include edit data");
        }
        final User user = us.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).orElseThrow(UserNotFoundException::new);
        if(user.getId() != id) {
            throw new ForbiddenException();
        }

        if(us.checkPassword(editProfileDto.getCurrentPassword(), user)) {
            us.setPassword(editProfileDto.getPassword(), user, "restore");
        } else {
            throw new BadRequestException();
        }

        LOGGER.info("PUT /{}: User {} profile Updated", uriInfo.getPath(), id);
        return Response.ok().build();
    }

    // * ---------------------------------------------------------------------------------------------------------------

    // * ------------------------------------------------Forgot Password (desde el login)-------------------------------
    @Path("/login/{email}/forgotPassword")
    @POST
    @Consumes(value = {MediaType.APPLICATION_JSON})
    @Produces(value = {MediaType.APPLICATION_JSON})
    public Response loginForgotPassword(@PathParam("email") final String email) {
        User user = us.findByEmail(email).orElseThrow(UserNotFoundException::new);
        us.setPassword(null, user, "forgotten");
        return Response.noContent().build();
    }
    // * ---------------------------------------------------------------------------------------------------------------

    // * ------------------------------------------------Promote User-------------------------------
    @Path("/promoteUser/{userId}")
    @PUT
    @Produces(value = {MediaType.APPLICATION_JSON})
    public Response promoteUSer(@PathParam("userId") final long userId) {
        LOGGER.info("PUT /{}: Called", uriInfo.getPath());
        User user = us.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).orElseThrow(UserNotFoundException::new);
        if(!Objects.equals(user.getRole(), "admin")) {
            throw new ForbiddenException();
        }
        User user2 = us.findById(userId).orElseThrow(UserNotFoundException::new);
        us.promoteUser(user2);
        LOGGER.info("PUT /{}: Returning user promoted", uriInfo.getPath());
        return Response.noContent().build();
    }
    // * ---------------------------------------------------------------------------------------------------------------

}
