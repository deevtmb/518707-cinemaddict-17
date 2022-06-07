import FilterPresenter from './presenter/filter-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import CommentsModel from './model/comments-model.js';
import FilmsApiService from './api-services/films-api-service.js';
import CommentsApiService from './api-services/comments-api-service.js';

const AUTHORIZATION = 'Basic 4ut0r1z4t1on';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const siteMainElement = document.querySelector('.main');

const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(new CommentsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter(siteMainElement, filmsModel, filterModel, commentsModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

filterPresenter.init();
boardPresenter.init();
filmsModel.init();
