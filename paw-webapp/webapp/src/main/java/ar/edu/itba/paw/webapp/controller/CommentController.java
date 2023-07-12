package ar.edu.itba.paw.webapp.controller;

import ar.edu.itba.paw.webapp.exceptions.CommentNotFoundException;
import ar.edu.itba.paw.webapp.exceptions.ReviewNotFoundException;
import ar.edu.itba.paw.webapp.exceptions.UserNotFoundException;
import ar.edu.itba.paw.models.Comment;
import ar.edu.itba.paw.models.PageWrapper;
import ar.edu.itba.paw.models.Review;
import ar.edu.itba.paw.models.User;
import ar.edu.itba.paw.services.*;
import ar.edu.itba.paw.webapp.dto.request.NewCommentDto;
import ar.edu.itba.paw.webapp.dto.response.CommentDto;
import ar.edu.itba.paw.webapp.utilities.ResponseBuildingUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Path("comments")
@Component
public class CommentController {
    @Autowired
    private ReviewService rs;
    @Autowired
    private UserService us;
    @Autowired
    private CommentService ccs;
    @Autowired
    private ReportService rrs;
    @Context
    UriInfo uriInfo;
    private static final Logger LOGGER = LoggerFactory.getLogger(CommentController.class);
    private static final int CONTENT_AMOUNT = 3;
    
    // * ---------------------------------------------Comment GET ------------------------------------------------------
    //Endpoint para pedir los comentarios de una review
    @GET
    @Path("/{reviewId}")
    @Produces(value = {MediaType.APPLICATION_JSON})
    public Response getReviewComments(@PathParam("reviewId") final long reviewId) {

        LOGGER.info("GET /{}: Called", uriInfo.getPath());
        Review review = rs.findById(reviewId).orElseThrow(ReviewNotFoundException::new);
        List<Comment> comments = ccs.getReviewComments(review);
        Collection<CommentDto> commentListDto = CommentDto.mapCommentToCommentDto(uriInfo, comments);
        LOGGER.info("GET /{}: Comments got from review with id {}", uriInfo.getPath(), reviewId);
        return Response.ok(new GenericEntity<Collection<CommentDto>>(commentListDto){}).build();
    }
    // * ---------------------------------------------------------------------------------------------------------------


    // * ---------------------------------------------Comment POST------------------------------------------------------
    // Endpoint para crear un comentario
    @POST
    @Produces(value = {MediaType.APPLICATION_JSON})
    @Path("/{reviewId}/add")
    public Response commentReviewAdd(@PathParam("reviewId")final long reviewId,
                                     @Valid NewCommentDto commentDto) {
        LOGGER.info("POST /{}: Called", uriInfo.getPath());
        if(commentDto==null)
            throw new BadRequestException("Must include comment data");

        final Review review = rs.getReview(reviewId).orElseThrow(ReviewNotFoundException::new);
        final User user = us.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).orElseThrow(UserNotFoundException::new);

        Comment newComment = ccs.addComment(review, user, commentDto.getComment());

        LOGGER.info("POST /{}: Comment created with id {}", uriInfo.getPath(), newComment.getCommentId());
        return Response.created(CommentDto.getCommentUriBuilder(newComment, uriInfo).build()).build();
    }
    // * ---------------------------------------------------------------------------------------------------------------


    // * ---------------------------------------------Comments DELETE---------------------------------------------------
    // Endpoint para borrar un comment
    @DELETE
    @Path("/delete/{commentId}")
    public Response commentReviewDelete(@PathParam("commentId") final long commentId) {
        LOGGER.info("DELETE /{}: Called", uriInfo.getPath());

        Optional<User> user = us.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName());
        Optional<Comment> deleteComment = ccs.getComment(commentId);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if(!deleteComment.isPresent()) {
            throw new CommentNotFoundException();
        }

        if(user.get().getUserName().equals(deleteComment.get().getUser().getUserName())) {
            ccs.deleteComment(deleteComment.get());
        }
        else if(auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            rrs.delete(deleteComment.get(), deleteComment.get().getReports());
        } else {
            LOGGER.warn("DELETE /{}: Not allowed to delete",uriInfo.getPath(), new ForbiddenException());
            throw new ForbiddenException();
        }

        LOGGER.info("DELETE /{}: Comment {} deleted successfully", uriInfo.getPath(), commentId);
        return Response.noContent().build();

    }

    // * ---------------------------------------------------------------------------------------------------------------

}
