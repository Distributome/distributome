function distMaker(num1, parm1)
{
	this.parms=parm1;
	this.dist=0; this.distGraph=0;
	this.graphKey=num1;
	this.distCanvas=0;
	 this.initialize=function(){
		this.distCanvas = document.getElementById("distcanv");
		this.setDist();	
	}

	this.setDist=function()
	{
		switch(this.graphKey)
		{
			//Discrete uniform a,n
			case 1:
				this.dist = new DiscreteUniformDistribution(this.parms[0],this.parms[1]);
				break;
			
			//Pareto k,b
			case 2:
				this.dist = new ParetoDistribution(this.parms[0],this.parms[1]);
				break;
			//poisson lambda
			case 3:
				this.dist = new PoissonDistribution(this.parms[0]);
				break;
			
			//negative binomial k,p
			case 4:
				this.dist = new NegativeBinomialDistribution(this.parms[0],this.parms[1]);
				break;
			
			//hypergeometric m,k,n
			case 5:
				this.dist = new HypergeometricDistribution(this.parms[0],this.parms[1],this.parms[2]);
				break;
			
			//exponential b
			case 6:
				this.dist = new ExponentialDistribution(this.parms[0]);
				break;
			
			//normal mu, sigma
			case 7:
				this.dist = new NormalDistribution(this.parms[0],this.parms[1]);
				break;
				
			//geometric 1,p
			case 8:
				this.dist = new NegativeBinomialDistribution(1,this.parms[0]);
				break;
			
			//beta a,b
			case 9:
				this.dist = new BetaDistribution(this.parms[0],this.parms[1]);
				break;
			
			//fdist n,d
			case 10:
				this.dist = new FDistribution(this.parms[0],this.parms[1]);
				break;
			
			//log normal mu, sigma
			case 11:
				this.dist = new LogNormalDistribution(this.parms[0],this.parms[1]);
				break;
				
			//binomial n,p
			case 12:
				this.dist = new BinomialDistribution(this.parms[0],this.parms[1]);
				break;
			
			//laplace a,b
			case 13:
				this.dist = new LaplaceDistribution(this.parms[0],this.parms[1]);
				break;
				
			//maxwell boltzmann a
			case 14:
				this.dist = new MaxwellBoltzmannDistribution(this.parms[0]);
				break;
			
			//chisquare n
			case 15:
				this.dist = new ChiSquareDistribution(this.parms[0]);
				break;
			
			//cont uniform a,a+w
			case 16:
				this.dist = new UniformDistribution(this.parms[0],this.parms[1]+this.parms[0]);
				break;
				
			//gamma k,b
			case 17:
				this.dist = new GammaDistribution(this.parms[0],this.parms[1]);
				break;
				
			//weibull k,b
			case 18:
				this.dist = new WeibullDistribution(this.parms[0],this.parms[1]);
				break;
			
			//cauchy a,b
			case 19:
				this.dist = new CauchyDistribution(this.parms[0],this.parms[1]);
				break;
				
			//arcsine n
			case 20:
				this.dist = new DiscreteArcsineDistribution(this.parms[0]);
				break;
			
			//students n
			case 21:
				this.dist = new StudentDistribution(this.parms[0]);
				break;
			
			//logistic a,b
			case 22:
				this.dist = new LogisticDistribution(this.parms[0],this.parms[1]);
				break;
			
		/*---------------------------------------End Simple-------------------------------------------*/
			
			//beta negative binomial a,b,k
			case 23:
				this.dist = new BetaNegativeBinomialDistribution(this.parms[0],this.parms[1],this.parms[2]);
				break;
			
			//Benford first digit b
			case 24:
				this.dist = new BenfordDigitDistribution(this.parms[0]);
				break;
			
			//beta binomial a,b,n
			case 25:
				this.dist = new BetaBinomialDistribution(this.parms[0],this.parms[1],this.parms[2]);
				break;
				
			//birthday m,n
			case 26:
				this.dist = new BirthdayDistribution(this.parms[0],this.parms[1]);
				break;
				
			//expon log p,b
			case 27:
				this.dist = new ExponentialLogarithmicDistribution(this.parms[0],this.parms[1]);
				break;	
				
			//coupon m,k
			case 28:
				this.dist = new CouponDistribution(this.parms[0],this.parms[1]);
				break;	
				
			//extremevalue a,b
			case 29:
				this.dist = new ExtremeValueDistribution(this.parms[0],this.parms[1]);
				break;	
			
			//folded normal mu, sigma
			case 30:
				this.dist = new FoldedNormalDistribution(this.parms[0],this.parms[1]);
				break;
			
			//hyper secant mu,sigma
			case 31:
				this.dist = new HyperbolicSecantDistribution(this.parms[0],this.parms[1]);
				break;
			default:
				alert("Error:Unknown GraphType Encountered");
				break;
		}
		this.distGraph = new QuantileGraph(this.distCanvas, this.dist, "X");
		this.distGraph.setGraphType(0);
		this.setProb();	
	}

	this.setProb=function(){
		this.distGraph.setProb(.999);
	}
}