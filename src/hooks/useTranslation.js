import { useDispatch, useSelector } from 'react-redux';
import { setLanguage as setReduxLanguage } from '../State/slices/appSlice';
import { translations } from '../utils/translations';

const useTranslation = () => {
    const language = useSelector((state) => state.app.language);
    const dispatch = useDispatch();

    const setLanguage = (lang) => {
        dispatch(setReduxLanguage(lang));
    };

    const t = (key) => {
        return translations[language]?.[key] || key;
    };

    return { t, language, setLanguage };
};

export default useTranslation;
