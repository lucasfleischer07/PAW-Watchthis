import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import {Link, useParams} from "react-router-dom";
import {userService} from "../services";
import {toast} from "react-toastify";

export default function UserInfoPage() {
    const {t} = useTranslation()
    // let {isLogged} = useContext(AuthContext)
    const { userProfileId } = useParams();

    const [user, setUser] = useState(localStorage.hasOwnProperty("user")? JSON.parse(localStorage.getItem("user")) : null)
    const [reviewOwnerUser, setReviewOwnerUser] = useState({})
    const [isSameUser, setIsSameUser] = useState(undefined)
    const [canPromote, setCanPromote] = useState(undefined)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(undefined)
    const [reviews, setReviews] = useState([])
    const [reputation, setReputation] = useState(0)

    const handlePromoteUser = (e) => {
        e.preventDefault();
        userService.promoteUserToAdmin(reviewOwnerUser.id)
            .then(data => {
                if(!data.error) {
                    setCanPromote(false)
                    toast.success(t('Profile.PromoteUser.Success'))
                } else {
                    toast.error(t('Profile.PromoteUser.Error'))
                }
            })
            .catch(e => {
            //     TODO: LLEVAR A PAGINA DE ERROR O ALGO ASI
            })
    }

    useEffect(() => {
        userService.getUserReviews(parseInt(userProfileId), currentPage)
            .then(reviews => {
                if(!reviews.error) {
                    setReviews(reviews.data)
                    if(reviews.data.length === 0) {
                         userService.getUserInfo(parseInt(userProfileId))
                             .then((data) => {
                                 if(!data.error) {
                                    setReviewOwnerUser(data.data)
                                 }
                             })
                            .catch(e => {
                            //     TODO: Pagina de error
                            })
                        setReputation(0)
                    } else {
                        setReviewOwnerUser(reviews.data[0].user)
                        let reputation = 0
                        for(let i = 0; i < reviews.data.length; i++) {
                            reputation += reviews.data[i].reputation
                        }
                        setReputation(reputation)
                    }
                    setTotalPages(reviews.totalPages)

                    if(user.id === parseInt(userProfileId)) {
                        setIsSameUser(true)
                    } else {
                        setIsSameUser(false)
                    }

                    if(user.role === 'admin' && reviews.data[0].user.role !== 'admin') {
                        setCanPromote(true)
                    } else {
                        setCanPromote(false)
                    }
                }

            })
            .catch(e => {
            //     TODO: Si no existe el usuario, hay que llevar a la pagina de error
            })

    }, [])


    const tooltip =
        <OverlayTrigger
            placement="bottom"
            overlay = {
                <Tooltip>
                    {t('Reputation.Tooltip')}
                </Tooltip>
            }>
            <li className="list-inline-item">
                <h4 className="font-weight-bold mb-0 d-block">{reputation}</h4>
                <span className="text-muted"><i className="fas fa-image mr-1"></i>{t('Profile.Reputation')}</span>
            </li>
        </OverlayTrigger>

    return(
        // TODO: METER HEADER

        <div className="row py-5 px-4 W-set-margins">
            <div className="col-md-5 mx-auto W-profile-general-div-display">
                <div className="bg-white shadow rounded overflow-hidden W-profile-general-div">
                    <div className="W-profile-background-color bg-dark">
                        <div className="media align-items-end">
                            <div className="profile mr-3">
                                <div className="W-img-and-quote-div">
                                    <div>
                                        {reviewOwnerUser.image == null ? (
                                            <img src={"/images/defaultUserImg.png"} alt="User_img" className="W-edit-profile-picture" />
                                        ) : (
                                            <img src={reviewOwnerUser.image} alt="User_img" className="W-edit-profile-picture" />
                                        )}
                                        <h4 className="W-username-profilepage">{reviewOwnerUser.username}</h4>
                                    </div>
                                    {/*<div className="W-margin-left-label">*/}
                                    {/*    <p className="W-quote-in-profile">{quote}</p>*/}
                                    {/*</div>*/}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-light p-4 d-flex text-center W-editProfileButton-and-reviewsCant">
                        <div className="W-edition-and-admin-buttons">
                            {isSameUser && (
                                <Link to="/user/profile/editProfile" className="btn btn-outline-dark btn-block W-editProfile-button">
                                    {t('Profile.EditProfile')}
                                </Link>
                            )}
                            {!isSameUser && canPromote && (
                                <form onSubmit={handlePromoteUser} className="W-delete-form" id={`user${reviewOwnerUser.username}`} method="post">
                                    <button type="submit" className={`btn btn-outline-dark btn-sm btn-block`}>
                                        {t('Profile.PromoteUser')}
                                    </button>
                                </form>
                            )}
                        </div>
                        <ul className="list-inline mb-0">
                            <li className="list-inline-item">
                                <h4 className="font-weight-bold mb-0 d-block">{reviews.length}</h4>
                                {reviews.length === 1 ? (
                                    <span className="text-muted"><i className="fas fa-image mr-1"></i>{t('Profile.Review')}</span>
                                ) : (
                                    <span className="text-muted"><i className="fas fa-image mr-1"></i>{t('Profile.Reviews')}</span>
                                )}
                            </li>
                            {tooltip}
                            {/*<li className="list-inline-item" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title={t('Reputation.Tooltip')}>*/}
                            {/*    <h4 className="font-weight-bold mb-0 d-block">{reputation}</h4>*/}
                            {/*    <span className="text-muted"><i className="fas fa-image mr-1"></i>{t('Profile.Reputation')}</span>*/}
                            {/*</li>*/}
                        </ul>
                    </div>

                    <div className="py-4 px-4">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <h4 className="mb-0">{t('Profile.RecentReviews')}</h4>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                {reviews.length === 0 ? (
                                    <div className="W-no-reviews-icon">
                                        <img className="W-no-reviews-image" src={"/images/noReviews.png"} alt="No_Review_Img"/>
                                        {isSameUser ? (
                                            <h4 className="W-no-reviews-text">{t('Profile.NoReviews.Owner')}</h4>
                                        ) : (
                                            <h4 className="W-no-reviews-text">{t('Profile.NoReviews.NotOwner', {user: reviewOwnerUser.username})}</h4>
                                        )}
                                    </div>
                                ) : (
                                    reviews.map((review) => (
                                        <div key={review.id}>
                                            {/*TODO: CAMBIAR EL TO, deberia ser el content con el id*/}
                                            <Link className="W-movie-title" to={`/content/${review.content.type}/${review.content.id}`}>
                                                <h5>{review.content.name}</h5>
                                            </Link>
                                            {/*<ReviewCard*/}
                                            {/*    reviewTitle={review.name}*/}
                                            {/*    reviewDescription={review.description}*/}
                                            {/*    reviewRating={review.rating}*/}
                                            {/*    reviewId={review.id}*/}
                                            {/*    userName={review.user.name}*/}
                                            {/*    contentId={review.content.id}*/}
                                            {/*    reviewReputation={review.reputation}*/}
                                            {/*    contentType={review.type}*/}
                                            {/*    loggedUserName={user}*/}
                                            {/*    isAdmin={canPromote}*/}
                                            {/*    isLikeReviews={userLikeReviews.includes(review.id)}*/}
                                            {/*    isDislikeReviews={userDislikeReviews.includes(review.id)}*/}
                                            {/*    alreadyReport={review.reporterUsernames.includes(userName)}*/}
                                            {/*    canComment={false}*/}
                                            {/*/>*/}
                                        </div>
                                    ))
                                )}

                                {/*TODO: NOSE QUE ES ESTO DE c:set*/}
                                {/*{isSameUser ? (*/}
                                {/*    <c:set var="readMorepath" value="/profile/${userProfile}" />*/}
                                {/*) : (*/}
                                {/*    <c:set var="readMorepath" value="/profile" />*/}
                                {/*)}*/}

                                {/*TODO: METER PAGINACION*/}
                                {/*{pageSelected < amountPages && (*/}
                                {/*    <div className="W-readMore-button">*/}
                                {/*        <a id="readMore" className="W-readMore-a" href={`${readMorepath}/page/${pageSelected + 1}`}>*/}
                                {/*            <button type="button" className="btn btn-dark W-add-review-button W-reviewText">Reviews.ReadMore</button>*/}
                                {/*        </a>*/}
                                {/*    </div>*/}
                                {/*)}*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
}