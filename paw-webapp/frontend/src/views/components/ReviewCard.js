// import Reputation from "./Reputation";
// import {useTranslation} from "react-i18next";
// export default function ReviewCard(props){
//     const reviewId=props.reviewId
//     const reviewUser=props.reviewUser
//     const loggedUser=props.loggedUser
//     const isAdmin=props.isAdmin
//     const reviewRating=props.reviewRating
//     const ratingStars = [];
//     const reviewTitle=props.reviewTitle
//     const {t} = useTranslation()
//     for (let i = 1; i <= 5; i++) {
//         ratingStars.push(
//             i <= reviewRating ? (
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
//                      className="bi bi-star-fill W-reviewCard-stars" viewBox="0 0 16 16">
//                     <path
//                         d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
//                 </svg>
//             ) : (
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-star W-reviewCard-stars"
//                      viewBox="0 0 16 16">
//                     <path
//                         d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
//                 </svg>
//             )
//         );
//     }
//
//     return(
//         <div className="accordion W-accordion-margin" id={`accordion${reviewId}`}>
//             <div className="accordion-item">
//                 <div className="accordion-header" id={`heading${reviewId}`}>
//                     <div className="card">
//                         <div className="card-header W-accordion-card-header">
//                             <link to={`/profile/${reviewUser}`} className="W-creator-review">
//                                 {reviewUser}
//                             </link>
//                             <div className="W-delete-edit-report-review-buttons">
//                                 {user.equals(loggedUser) &&(
//                                     <div>
//                                         <div className="W-delete-edit-buttons">
//                                             <button className="W-delete-form" id={`deleteReviewButton${reviewId}`}
//                                                   onClick={handleDelete}>
//                                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
//                                                      fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
//                                                     <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
//                                                 </svg>
//                                             </button>
//                                             <link className="W-edit-button-review"
//                                                to={`/reviewForm/edit/${param.contentType}/${param.contentId}/${param.reviewId}`}>
//                                                 <button id={`editReviewButton${reviewId}`} className="btn btn-dark text-nowrap">
//                                                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
//                                                          fill="currentColor" className="bi bi-pencil-square"
//                                                          viewBox="0 0 16 16">
//                                                         <path
//                                                             d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
//                                                         <path fill-rule="evenodd"
//                                                               d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
//                                                     </svg>
//                                                 </button>
//                                             </link>
//
//                                         </div>
//                                     </div>
//
//                                 )}
//                                 {isAdmin &&(
//                                     <button className="W-delete-form" id={`deleteReviewButton${reviewId}`}
//                                             onClick={handleDelete}>
//                                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
//                                              fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
//                                             <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
//                                         </svg>
//                                     </button>
//                                 )}
//                             </div>
//                         </div>
//                         <div className="card-body W-accordion-card-body">
//                             <button id={`button${reviewId}`}
//                                     className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
//                                     data-bs-target={`#collapse${reviewId}`} aria-expanded="false" aria-controls={`collapse${reviewId}`}
//                             >
//                                 <div className="W-stars">
//                                     {ratingStars}
//                                 </div>
//                                 <div className="W-review-title-creator">
//                                     <h2 className="W-title-review">
//                                         {reviewTitle}
//                                     </h2>
//                                 </div>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//                 <div id={`collapse${reviewId}`} class="accordion-collapse collapse" aria-labelledby={`heading${reviewId}`} data-bs-parent={`#accordion${reviewId}`}>
//                     <div class="accordion-body">
//                         <Reputation
//                             reviewId={reviewId}
//                             user={user}
//                             reviewDescription={reviewDescription}
//                             isAdmin={isAdmin}
//                         />
//                     </div>
//                 </div>
//             </div>
//             <div className="modal fade" id={`modalDeleteReview${reviewId}`} tabIndex="-1"
//                  aria-labelledby={`modalLabel${reviewId}`} aria-hidden="true">
//                 <div className="modal-dialog">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h5 className="modal-title" id={`modalLabel${reviewId}`}>
//                                 {t("Delete.Confirmation")}
//                             </h5>
//                             <button type="button" className="btn-close" data-bs-dismiss="modal"
//                                     aria-label="Close"></button>
//                         </div>
//                         <div className="modal-body">
//                             <p>
//                                 {t("DeleteReview")}
//                             </p>
//                         </div>
//                         <div className="modal-footer">
//                             <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
//                                 {t("No")}
//                             </button>
//                             <button type="submit" form={`formDeleteReview${reviewId}`}
//                                     className="btn btn-success"
//                                     onClick={handleDelete}>
//                                 {t("Yes")}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className="modal fade" id={`reportReviewModal${reviewId}`} tabIndex="-1"
//                  aria-labelledby={`reportReviewModalLabel${reviewId}`} aria-hidden="true">
//                 <div className="modal-dialog">
//                     <form:form id={`reportReviewForm${reviewId}`} modelAttribute="reportReviewForm"
//                                action={handleAddReport} method="post" enctype="multipart/form-data">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h5 className="modal-title" id={`reportReviewModalLabel${param.reviewId}`}>
//                                     {t("Report.ReviewTitle")}
//                                 </h5>
//                                 <button type="button" className="btn-close" data-bs-dismiss="modal"
//                                         aria-label="Close"></button>
//                             </div>
//                             <div className="modal-body">
//                                 <div>
//                                     <ul className="W-no-bullets-list">
//                                         <li>
//                                             <label>
//                                                 <form:radiobutton path="reportType" value="Spam"/>
//                                                     {t("Report.Spam")}
//                                                 <p className="W-modal-comment-desc">
//                                                     {t("Report.Spam.Description")}
//                                                 </p>
//                                             </label>
//                                         </li>
//                                         <li>
//                                             <label>
//                                                 <form:radiobutton path="reportType" value="Insult"/>
//                                                     {t("Report.Insult")}
//                                                 <p className="W-modal-comment-desc">
//                                                     {t("Report.Insult.Description")}
//                                                 </p>
//                                             </label>
//                                         </li>
//                                         <li>
//                                             <label>
//                                                 <form:radiobutton path="reportType" value="Inappropriate"/>
//                                                     {t("Report.Inappropriate")}
//                                                 <p className="W-modal-comment-desc">
//                                                     {t("Report.Inappropriate.Description")}
//                                                 </p>
//                                             </label>
//                                         </li>
//                                         <li>
//                                             <label>
//                                                 <form:radiobutton path="reportType" value="Unrelated"/>
//                                                     {t("Report.Unrelated")}
//                                                 <p className="W-modal-comment-desc">
//                                                     {t("Report.Unrelated.Description")}
//                                                 </p>
//                                             </label>
//                                         </li>
//                                         <li>
//                                             <label>
//                                                 <form:radiobutton path="reportType" value="Other"/>
//                                                 {t("Report.Other")}
//                                                 <p className="W-modal-comment-desc">
//                                                     {t("Report.Other.Description")}
//                                                 </p>
//                                             </label>
//                                         </li>
//                                     </ul>
//                                 </div>
//                             </div>
//                             <div className="modal-footer">
//                                 <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
//                                     {t("Close")}
//                                 </button>
//                                 <button type="submit" className="btn btn-success"
//                                         onClick="this.form.submit()">
//                                     {t("Form.Submit")}
//                                 </button>
//                             </div>
//                         </div>
//                     </form:form>
//                 </div>
//             </div>
//         </div>
//     );
// }