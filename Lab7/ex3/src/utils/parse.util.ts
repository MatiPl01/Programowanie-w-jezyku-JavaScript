import Action from "../enums/action.enum";


const parse = (array: (string | null)[]): (Action | null)[] => {
    return array.map(el => {
        switch (el) {
            case 'd-': return Action.DAY_EARLIER;
            case 'd+': return Action.DAY_LATER;
            case 'h-': return Action.HOUR_EARLIER;
            case 'h+': return Action.HOUR_LATER;
            case null: return null;
            default: throw new Error(`Unrecognized value: ${el}`);
        }
    })
};


export default parse;
