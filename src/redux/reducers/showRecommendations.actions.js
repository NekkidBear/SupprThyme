// showRecommendations.actions.js
export const TOGGLE_RECOMMENDATIONS = 'TOGGLE_RECOMMENDATIONS';

export const toggleRecommendations = (show) => ({
  type: TOGGLE_RECOMMENDATIONS,
  payload: show,
});