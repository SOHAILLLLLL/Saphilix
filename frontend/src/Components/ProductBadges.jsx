export const ProductBadges = ({ isNew, discount, badge }) => (
  <div className="absolute top-3 left-3 flex flex-col gap-2">
    {isNew && <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">New</span>}
    {badge && <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">{badge}</span>}
    {discount > 0 && <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">-{discount}%</span>}
  </div>
);