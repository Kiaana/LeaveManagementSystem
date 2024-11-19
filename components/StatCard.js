const StatCard = ({ icon: Icon, title, value, loading, bgColor, iconColor, href }) => (
    <Link href={href} legacyBehavior>
      <motion.a 
        className={`${bgColor} p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center cursor-pointer`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Icon className={`${iconColor} text-4xl mb-4`} />
        <h2 className="text-lg md:text-xl font-semibold text-center">{title}</h2>
        {loading ? (
          <FaSpinner className={`animate-spin ${iconColor} text-3xl mt-2`} />
        ) : (
          <p className="text-3xl md:text-4xl font-bold mt-2">{value}</p>
        )}
      </motion.a>
    </Link>
  );

export default StatCard;